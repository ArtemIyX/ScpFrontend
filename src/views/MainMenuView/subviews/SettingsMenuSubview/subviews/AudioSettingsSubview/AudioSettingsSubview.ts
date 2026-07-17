import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'

import type { GComboOption } from '@/components/g/GCombo/GCombo'
import { useSettingsStore } from '@/stores/settings'

type TalkMode = 'push-to-talk' | 'voice-activation'

const outputDeviceOptions: GComboOption[] = [
  { value: 'default-output', label: 'Default Device' },
  { value: 'headphones-usb', label: 'Headphones (USB)' },
  { value: 'speakers-desktop', label: 'Speakers (Desktop)' },
  { value: 'virtual-output', label: 'Virtual Output' },
]

const inputDeviceOptions: GComboOption[] = [
  { value: 'default-input', label: 'Default Microphone' },
  { value: 'headset-mic', label: 'Headset Mic' },
  { value: 'desk-mic', label: 'Desk Microphone' },
]

const talkModes: Array<{ value: TalkMode; label: string; helper: string }> = [
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
      inputDevice,
      masterVolume,
      musicVolume,
      outputDevice,
      sfxVolume,
      talkMode,
      uiVolume,
      voiceActivationThreshold,
      voiceVolume,
    } = storeToRefs(settingsStore)

    const voiceActivationDisabled = computed(() => talkMode.value !== 'voice-activation')
    const hoverHelpDelay = 600

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
      audioHelp,
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
