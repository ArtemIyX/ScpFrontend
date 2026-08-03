import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'

import { useSettingsStore } from '@/stores/settings'
import { provideLocalizationTable } from '@/localization'
import { LocalizationTable } from '@/localization/tags'

export default defineComponent({
  name: 'ControlsSettingsSubview',
  setup() {
    provideLocalizationTable(LocalizationTable.SettingsControls)
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
