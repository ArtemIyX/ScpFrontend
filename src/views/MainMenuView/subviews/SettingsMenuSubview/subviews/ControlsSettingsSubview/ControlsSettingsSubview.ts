import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'

import { useSettingsStore } from '@/stores/settings'

export default defineComponent({
  name: 'ControlsSettingsSubview',
  setup() {
    const settingsStore = useSettingsStore()
    const {
      autoSwitchNewItemPickedUp,
      holdToCrouch,
      holdToSeeInventory,
      holdToSelectItem,
      holdToSprint,
      invertYAxis,
      mouseSensitivity,
    } = storeToRefs(settingsStore)

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
