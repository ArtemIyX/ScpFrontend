import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import type { GComboOption } from '@/components/g/GCombo/GCombo'
import {
  AudioMixerType,
  AudioSettingRequestType,
  AudioTalkMode,
  RequestGetAudioSettings,
  RequestSetAudioSettings,
  ResponseAudioSettings,
  type AudioCaptureDevicesResponse,
  type AudioMixerResponse,
  type AudioPlaybackDevicesResponse,
  type AudioVoiceChatData,
  type RequestSetAudioSettings as RequestSetAudioSettingsShape,
} from '@/proto/gen/audio_settings'
import { MessageType } from '@/proto/gen/scp_webui'
import { getScpWebSocketClient } from '@/services'
import { useSettingsStore, type AudioTalkMode as AudioTalkModeValue } from '@/stores/settings'

const audioRequestTypes: AudioSettingRequestType[] = [
  AudioSettingRequestType.AUDIO_SETTING_PLAYBACK_DEVICE,
  AudioSettingRequestType.AUDIO_SETTING_CAPTURE_DEVICE,
  AudioSettingRequestType.AUDIO_SETTING_VOICE_CHAT,
  AudioSettingRequestType.AUDIO_SETTING_MIXER,
]

const talkModes: Array<{ value: AudioTalkModeValue; label: string; helper: string }> = [
  {
    value: 'push-to-talk',
    label: 'Push-to-talk',
    helper: 'Transmit only while the chat key is held.',
  },
  {
    value: 'voice-activation',
    label: 'Voice activation',
    helper: 'Open mic voice chat with a detection threshold.',
  },
]

export default defineComponent({
  name: 'AudioSettingsSubview',
  setup() {
    const settingsStore = useSettingsStore()
    const {
      ambientVolume,
      audioSettingsLoadState,
      inputDevice,
      inputDeviceOptions,
      masterVolume,
      musicVolume,
      outputDevice,
      outputDeviceOptions,
      sfxVolume,
      talkMode,
      uiVolume,
      voiceActivationThreshold,
      voiceVolume,
    } = storeToRefs(settingsStore)

    const websocketConnected = ref(getScpWebSocketClient()?.connectionState === 'open')
    const pendingAudioRequestTypes = ref<Set<AudioSettingRequestType>>(new Set(audioRequestTypes))
    const audioSettingsLoaded = computed(
      () => !websocketConnected.value || audioSettingsLoadState.value === 'loaded',
    )
    const voiceActivationDisabled = computed(() => talkMode.value !== 'voice-activation')
    const hoverHelpDelay = 600
    let unsubscribeResponse: (() => void) | null = null
    let unsubscribeState: (() => void) | null = null

    function mapProtoTalkMode(mode: AudioTalkMode | undefined): AudioTalkModeValue {
      switch (mode) {
        case AudioTalkMode.VOICE_ACTIVATION:
          return 'voice-activation'
        case AudioTalkMode.PUSH_TO_TALK:
        default:
          return 'push-to-talk'
      }
    }

    function mapTalkMode(value: AudioTalkModeValue): AudioTalkMode {
      switch (value) {
        case 'voice-activation':
          return AudioTalkMode.VOICE_ACTIVATION
        case 'push-to-talk':
        default:
          return AudioTalkMode.PUSH_TO_TALK
      }
    }

    function sendAudioSettingsUpdate(message: RequestSetAudioSettingsShape): void {
      const client = getScpWebSocketClient()

      if (!client || client.connectionState !== 'open') {
        return
      }

      client.sendTypedMessage(
        MessageType.REQUEST_SET_AUDIO_SETTINGS,
        message,
        RequestSetAudioSettings,
      )
    }

    function applyAudioPlaybackResponse(payload: AudioPlaybackDevicesResponse | undefined): void {
      const result = payload?.result
      if (!result) {
        outputDeviceOptions.value = []
        outputDevice.value = null
        return
      }

      const options: GComboOption[] = result.arr.map((entry) => ({
        value: entry.deviceId,
        label: entry.displayName,
      }))

      outputDeviceOptions.value = options
      outputDevice.value = options[result.selected]?.value ?? options[0]?.value ?? null
    }

    function applyAudioCaptureResponse(payload: AudioCaptureDevicesResponse | undefined): void {
      const result = payload?.result
      if (!result) {
        inputDeviceOptions.value = []
        inputDevice.value = null
        return
      }

      const options: GComboOption[] = result.arr.map((entry) => ({
        value: entry.deviceId,
        label: entry.displayName,
      }))

      inputDeviceOptions.value = options
      inputDevice.value = options[result.selected]?.value ?? options[0]?.value ?? null
    }

    function applyAudioVoiceChatResponse(payload: AudioVoiceChatData | undefined): void {
      if (!payload) {
        return
      }

      talkMode.value = mapProtoTalkMode(payload.talkMode)
      voiceActivationThreshold.value = payload.threshold
    }

    function applyAudioMixerResponse(payload: AudioMixerResponse | undefined): void {
      if (!payload) {
        return
      }

      masterVolume.value = payload.master
      ambientVolume.value = payload.ambient
      uiVolume.value = payload.ui
      musicVolume.value = payload.music
      voiceVolume.value = payload.voice
      sfxVolume.value = payload.sfx
    }

    function applyAudioResponse(message: ResponseAudioSettings): void {
      pendingAudioRequestTypes.value.delete(message.requestedType)

      if (pendingAudioRequestTypes.value.size === 0) {
        audioSettingsLoadState.value = 'loaded'
      }

      switch (message.requestedType) {
        case AudioSettingRequestType.AUDIO_SETTING_PLAYBACK_DEVICE:
          applyAudioPlaybackResponse(message.playbackDevice)
          return
        case AudioSettingRequestType.AUDIO_SETTING_CAPTURE_DEVICE:
          applyAudioCaptureResponse(message.audioCaptureDevice)
          return
        case AudioSettingRequestType.AUDIO_SETTING_VOICE_CHAT:
          applyAudioVoiceChatResponse(message.voiceChat)
          return
        case AudioSettingRequestType.AUDIO_SETTING_MIXER:
          applyAudioMixerResponse(message.mixer)
          return
        default:
          return
      }
    }

    function requestAudioSettings(): void {
      const client = getScpWebSocketClient()

      if (!client || client.connectionState !== 'open' || audioSettingsLoadState.value !== 'idle') {
        return
      }

      audioSettingsLoadState.value = 'loading'
      pendingAudioRequestTypes.value = new Set(audioRequestTypes)

      for (const requestType of audioRequestTypes) {
        client.sendTypedMessage(
          MessageType.REQUEST_GET_AUDIO_SETTINGS,
          { requestType },
          RequestGetAudioSettings,
        )
      }
    }

    function applyPlaybackDevice(value: string | number | null): void {
      outputDevice.value = value

      const selectedIndex = outputDeviceOptions.value.findIndex((option) => option.value === value)
      if (selectedIndex < 0) {
        return
      }

      sendAudioSettingsUpdate({
        playback: {
          selectedIndex,
        },
      })
    }

    function applyCaptureDevice(value: string | number | null): void {
      inputDevice.value = value

      const selectedIndex = inputDeviceOptions.value.findIndex((option) => option.value === value)
      if (selectedIndex < 0) {
        return
      }

      sendAudioSettingsUpdate({
        capture: {
          selectedIndex,
        },
      })
    }

    function applyVoiceChat(
      mode = talkMode.value,
      threshold = voiceActivationThreshold.value,
    ): void {
      if (typeof threshold !== 'number') {
        return
      }

      talkMode.value = mode
      voiceActivationThreshold.value = threshold

      sendAudioSettingsUpdate({
        voiceChat: {
          talkMode: mapTalkMode(mode),
          threshold,
        },
      })
    }

    function applyTalkMode(value: string | number | boolean | null): void {
      if (value !== 'push-to-talk' && value !== 'voice-activation') {
        return
      }

      applyVoiceChat(value, voiceActivationThreshold.value)
    }

    function applyVoiceActivationThreshold(): void {
      applyVoiceChat(talkMode.value, voiceActivationThreshold.value)
    }

    function applyMixer(type: AudioMixerType, value: number | null): void {
      if (typeof value !== 'number') {
        return
      }

      sendAudioSettingsUpdate({
        mixer: {
          type,
          value,
        },
      })
    }

    onMounted(() => {
      const client = getScpWebSocketClient()

      if (!client) {
        return
      }

      unsubscribeResponse = client.onTypedMessage(
        MessageType.RESPONSE_AUDIO_SETTINGS,
        (message) => {
          applyAudioResponse(message)
        },
      )

      unsubscribeState = client.onStateChange((state) => {
        websocketConnected.value = state === 'open'
        if (state === 'open') {
          requestAudioSettings()
        }
      })

      if (client.connectionState === 'open') {
        requestAudioSettings()
      }
    })

    onUnmounted(() => {
      unsubscribeResponse?.()
      unsubscribeState?.()
    })

    const audioHelp = {
      playbackDevice:
        'Examples: Default Device, Headphones (USB), Speakers (Desktop). Use the output that should play game audio.',
      captureDevice:
        'Examples: Default Microphone, Headset Mic, Desk Microphone. Pick the input that hears your voice most clearly.',
      talkMode:
        'Push-to-talk sends voice only while held. Voice activation keeps the mic open and listens for speech.',
      voiceActivationThreshold:
        'Examples: 40 for a quiet headset, 60 for a normal room, 75 if background noise is loud. Lower is more sensitive.',
      masterVolume:
        'Controls the overall loudness of the entire game. Lower this first if the game feels too loud.',
      sfxVolume:
        'Affects footsteps, weapons, hits, doors, and other world effects.',
      uiVolume:
        'Affects menu clicks, confirmations, alerts, and interface sounds.',
      musicVolume:
        'Affects background music, stingers, and menu tracks.',
      voiceVolume:
        'Affects teammate comms, radio chatter, and spoken lines.',
      ambientVolume:
        'Affects wind, machinery hum, room tone, and environmental beds.',
    } as const

    return {
      ambientVolume,
      applyAmbientVolume: () => applyMixer(AudioMixerType.AUDIO_AMBIENT, ambientVolume.value),
      applyCaptureDevice,
      applyMasterVolume: () => applyMixer(AudioMixerType.AUDIO_MASTER, masterVolume.value),
      applyMusicVolume: () => applyMixer(AudioMixerType.AUDIO_MUSIC, musicVolume.value),
      applyPlaybackDevice,
      applySfxVolume: () => applyMixer(AudioMixerType.AUDIO_SFX, sfxVolume.value),
      applyTalkMode,
      applyUiVolume: () => applyMixer(AudioMixerType.AUDIO_UI, uiVolume.value),
      applyVoiceActivationThreshold,
      applyVoiceVolume: () => applyMixer(AudioMixerType.AUDIO_VOICE, voiceVolume.value),
      audioHelp,
      audioSettingsLoaded,
      hoverHelpDelay,
      inputDevice,
      inputDeviceOptions,
      masterVolume,
      musicVolume,
      outputDevice,
      outputDeviceOptions,
      sfxVolume,
      talkMode,
      talkModes,
      uiVolume,
      voiceActivationDisabled,
      voiceActivationThreshold,
      voiceVolume,
    }
  },
})
