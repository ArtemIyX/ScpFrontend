import { defineComponent, ref } from 'vue'

import type { GComboOption } from '@/components/g/GCombo/GCombo'

const aimProfileOptions: GComboOption[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'snappy', label: 'Snappy' },
  { value: 'weighted', label: 'Weighted' },
  { value: 'assist', label: 'Assisted' },
]

export default defineComponent({
  name: 'ControlsSettingsSubview',
  setup() {
    const mouseSensitivity = ref<number | null>(52)
    const aimSensitivity = ref<number | null>(46)
    const controllerDeadzone = ref<number | null>(18)
    const controllerVibration = ref<number | null>(60)
    const inputProfile = ref<string | number | null>('balanced')
    const invertVerticalLook = ref(false)
    const holdToSprint = ref(true)
    const tapToCrouch = ref(false)
    const toggleLean = ref(false)

    const hoverHelpDelay = 600

    const controlsHelp = {
      mouseSensitivity:
        'Sets how fast the camera reacts to mouse movement. Lower values feel steadier; higher values turn faster.',
      aimSensitivity:
        'Adjusts precision while aiming or using scoped interactions. Keep it lower than look sensitivity if you want finer control.',
      inputProfile:
        'Selects a control response profile tuned for fast, balanced, or heavier-feeling input behavior.',
      controllerDeadzone:
        'Raises the minimum stick movement required before the camera responds. Increase it if your controller drifts.',
      controllerVibration:
        'Controls how strongly the game shakes the controller during hits, alerts, and heavy impacts.',
      invertVerticalLook:
        'Swaps the vertical look axis for players who prefer flight-style camera movement.',
      holdToSprint:
        'Requires the sprint key to stay held down instead of toggling on and off.',
      tapToCrouch:
        'Lets crouch toggle with a tap rather than requiring the key to be held.',
      toggleLean:
        'Turns lean into a toggle state instead of a hold action for easier peeking.',
    } as const

    return {
      aimProfileOptions,
      controlsHelp,
      controllerDeadzone,
      controllerVibration,
      holdToSprint,
      hoverHelpDelay,
      inputProfile,
      invertVerticalLook,
      aimSensitivity,
      mouseSensitivity,
      tapToCrouch,
      toggleLean,
    }
  },
})
