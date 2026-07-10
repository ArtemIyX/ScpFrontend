import { defineComponent, ref } from 'vue'

import type { GRailItem } from '@/components/g/GRail/GRail'

type QualityValue = 'low' | 'medium' | 'high' | 'epic'
type MaterialQualityValue = 'low' | 'high'

const scalabilityItems: GRailItem[] = [
  {
    value: 'low',
    title: 'Low',
    meta: 'Tier 0',
  },
  {
    value: 'medium',
    title: 'Medium',
    meta: 'Tier 1',
  },
  {
    value: 'high',
    title: 'High',
    meta: 'Tier 2',
  },
  {
    value: 'epic',
    title: 'Epic',
    meta: 'Tier 3',
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
