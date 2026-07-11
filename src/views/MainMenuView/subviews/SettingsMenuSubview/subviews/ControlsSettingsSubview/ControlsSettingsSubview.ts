import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ControlsSettingsSubview',
  setup() {
    const mouseSensitivity = ref<number | null>(123.123)
    const invertYAxis = ref(false)
    const holdToSprint = ref(true)
    const holdToCrouch = ref(false)
    const holdToSelectItem = ref(false)
    const autoSwitchNewItemPickedUp = ref(true)
    const holdToSeeInventory = ref(false)

    return {
      autoSwitchNewItemPickedUp,
      holdToCrouch,
      holdToSeeInventory,
      holdToSelectItem,
      holdToSprint,
      invertYAxis,
      mouseSensitivity,
    }
  },
})
