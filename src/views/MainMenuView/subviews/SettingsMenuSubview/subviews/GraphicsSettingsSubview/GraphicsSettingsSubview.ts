import { defineComponent, ref } from 'vue'

import type { GRailItem } from '@/components/g/GRail/GRail'

type QualityValue = 'low' | 'medium' | 'high' | 'epic' | 'cinematic'
type MaterialQualityValue = 'low' | 'high'

const scalabilityItems: GRailItem[] = [
  {
    value: 'low',
    title: 'Very Low',
    meta: 'Performance',
  },
  {
    value: 'medium',
    title: 'Low',
    meta: 'Balanced',
  },
  {
    value: 'high',
    title: 'Medium',
    meta: 'Detailed',
  },
  {
    value: 'epic',
    title: 'High',
    meta: 'Ultra',
  },
  {
    value: 'cinematic',
    title: 'Ultra',
    meta: 'Showcase',
  },
] as const

const materialQualityItems: GRailItem[] = [
  {
    value: 'low',
    title: 'Low',
    meta: 'Budget',
  },
  {
    value: 'high',
    title: 'High',
    meta: 'Full',
  },
] as const

export default defineComponent({
  name: 'GraphicsSettingsSubview',
  setup() {
    const resolutionScale = ref<number | null>(100)
    const viewDistanceQuality = ref<QualityValue>('high')
    const antiAliasingQuality = ref<QualityValue>('high')
    const materialQualityLevel = ref<MaterialQualityValue>('high')

    return {
      antiAliasingQuality,
      materialQualityItems,
      materialQualityLevel,
      resolutionScale,
      scalabilityItems,
      viewDistanceQuality,
    }
  },
})
