import { computed, defineComponent, ref } from 'vue'

import type { GTabsItem } from '@/components/g/GTabs/GTabs'

import AudioSettingsSubview from './subviews/AudioSettingsSubview'
import DisplaySettingsSubview from './subviews/DisplaySettingsSubview'
import GameplaySettingsSubview from './subviews/GameplaySettingsSubview'
import GraphicsSettingsSubview from './subviews/GraphicsSettingsSubview'
import KeyBindingsSettingsSubview from './subviews/KeyBindingsSettingsSubview'

export const settingsTabs = [
  {
    value: 'display',
    label: 'Display',
  },
  {
    value: 'graphics',
    label: 'Graphics',
  },
  {
    value: 'gameplay',
    label: 'Gameplay',
  },
  {
    value: 'audio',
    label: 'Audio',
  },
  {
    value: 'key-bindings',
    label: 'Key-bindings',
  },
] as const satisfies readonly GTabsItem[]

export type SettingsTabValue = (typeof settingsTabs)[number]['value']

export default defineComponent({
  name: 'SettingsMenuSubview',
  components: {
    AudioSettingsSubview,
    DisplaySettingsSubview,
    GameplaySettingsSubview,
    GraphicsSettingsSubview,
    KeyBindingsSettingsSubview,
  },
  setup() {
    const activeTab = ref<SettingsTabValue>('display')

    const currentSubview = computed(() => {
      switch (activeTab.value) {
        case 'display':
          return DisplaySettingsSubview
        case 'graphics':
          return GraphicsSettingsSubview
        case 'gameplay':
          return GameplaySettingsSubview
        case 'audio':
          return AudioSettingsSubview
        case 'key-bindings':
          return KeyBindingsSettingsSubview
        default:
          return DisplaySettingsSubview
      }
    })

    return {
      activeTab,
      currentSubview,
      settingsTabs,
    }
  },
})
