import { computed, defineComponent, ref } from 'vue'

import type { GComboOption } from '@/components/g/GCombo/GCombo'

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
    const outputDevice = ref<string | number | null>('headphones-usb')
    const inputDevice = ref<string | number | null>('headset-mic')
    const talkMode = ref<TalkMode>('push-to-talk')

    const voiceActivationThreshold = ref<number | null>(55)
    const masterVolume = ref<number | null>(80)
    const sfxVolume = ref<number | null>(85)
    const uiVolume = ref<number | null>(70)
    const musicVolume = ref<number | null>(45)
    const voiceVolume = ref<number | null>(90)
    const ambientVolume = ref<number | null>(65)

    const voiceActivationDisabled = computed(() => talkMode.value !== 'voice-activation')

    return {
      ambientVolume,
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
