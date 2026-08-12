import { computed, defineComponent, onMounted, ref } from 'vue'

import type { GTabsItem } from '@/components/g/GTabs/GTabs'
import { preloadSettingsLocalizations } from '@/localization'

import AudioSettingsSubview from './subviews/AudioSettingsSubview'
import ControlsSettingsSubview from './subviews/ControlsSettingsSubview'
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
    value: 'controls',
    label: 'Controls',
  },
  {
    value: 'key-bindings',
    label: 'Key-bindings',
  },
] as const satisfies readonly GTabsItem[]

export type SettingsTabValue = (typeof settingsTabs)[number]['value']

interface DirtyGuardSubview {
  isDirty?: () => boolean
  saveChanges?: () => boolean
  discardChanges?: () => void
}

export default defineComponent({
  name: 'SettingsMenuSubview',
  components: {
    AudioSettingsSubview,
    ControlsSettingsSubview,
    DisplaySettingsSubview,
    GameplaySettingsSubview,
    GraphicsSettingsSubview,
    KeyBindingsSettingsSubview,
  },
  setup() {
    onMounted(() => preloadSettingsLocalizations())
    const activeTab = ref<SettingsTabValue>('display')
    const currentSubviewRef = ref<DirtyGuardSubview | null>(null)
    const pendingTab = ref<SettingsTabValue | null>(null)
    const showLeaveModal = ref(false)
    const isKeyBindingsDirty = ref(false)

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
        case 'controls':
          return ControlsSettingsSubview
        case 'key-bindings':
          return KeyBindingsSettingsSubview
        default:
          return DisplaySettingsSubview
      }
    })

    const decoratedTabs = computed(() =>
      settingsTabs.map((tab) =>
        tab.value === 'key-bindings' && isKeyBindingsDirty.value
          ? { ...tab, label: `${tab.label} *` }
          : tab,
      ),
    )

    function requestTabChange(nextTab: string | number | null | undefined): void {
      if (typeof nextTab !== 'string' || nextTab === activeTab.value) {
        return
      }

      const resolvedTab = nextTab as SettingsTabValue
      if (activeTab.value === 'key-bindings' && currentSubviewRef.value?.isDirty?.()) {
        pendingTab.value = resolvedTab
        showLeaveModal.value = true
        return
      }

      activeTab.value = resolvedTab
    }

    function closeLeaveModal(): void {
      pendingTab.value = null
      showLeaveModal.value = false
    }

    function proceedToPendingTab(): void {
      if (pendingTab.value) {
        activeTab.value = pendingTab.value
      }
      closeLeaveModal()
    }

    function saveAndLeave(): void {
      if (currentSubviewRef.value?.saveChanges?.() === false) {
        return
      }

      isKeyBindingsDirty.value = false
      proceedToPendingTab()
    }

    function discardAndLeave(): void {
      currentSubviewRef.value?.discardChanges?.()
      isKeyBindingsDirty.value = false
      proceedToPendingTab()
    }

    function onKeyBindingsDirtyChange(dirty: boolean): void {
      isKeyBindingsDirty.value = dirty
    }

    return {
      activeTab,
      closeLeaveModal,
      currentSubview,
      currentSubviewRef,
      decoratedTabs,
      discardAndLeave,
      onKeyBindingsDirtyChange,
      requestTabChange,
      saveAndLeave,
      showLeaveModal,
    }
  },
})
