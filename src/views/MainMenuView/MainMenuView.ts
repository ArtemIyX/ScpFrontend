import { computed, defineComponent, ref } from 'vue'

import PlayMenuSubview from './subviews/PlayMenuSubview'

export const menuTabs = [
  {
    value: 'play',
    label: 'Play',
    heading: 'Deploy Into The Facility',
    detail: 'Queue into containment, form a response squad, and re-enter the breach zone.',
    status: 'Squad channel online',
  },
  {
    value: 'documents',
    label: 'Documents',
    heading: 'Review Field Records',
    detail: 'Open recovered reports, incident logs, and classified directives before the next run.',
    status: 'Archive mirror synchronized',
  },
  {
    value: 'customization',
    label: 'Customization',
    heading: 'Tune Your Loadout',
    detail: 'Adjust operator profile, insignia, and surface kit elements used across the session.',
    status: 'Profile cache stable',
  },
  {
    value: 'settings',
    label: 'Settings',
    heading: 'Calibrate Runtime Systems',
    detail: 'Refine audio mix, visual clarity, and control behavior without breaking match flow.',
    status: 'Config bridge ready',
  },
] as const

export type MainMenuTabValue = (typeof menuTabs)[number]['value']

export default defineComponent({
  name: 'MainMenuView',
  components: {
    PlayMenuSubview,
  },
  setup() {
    const activeTab = ref<MainMenuTabValue>('play')

    const currentTab = computed(
      () => menuTabs.find((tab) => tab.value === activeTab.value) ?? menuTabs[0],
    )

    const currentSubview = computed(() => {
      if (activeTab.value === 'play') {
        return PlayMenuSubview
      }

      return null
    })

    return {
      activeTab,
      currentSubview,
      currentTab,
      menuTabs,
    }
  },
})
