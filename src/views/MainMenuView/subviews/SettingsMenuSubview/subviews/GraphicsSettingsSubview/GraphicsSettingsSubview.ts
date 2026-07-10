import { computed, defineComponent, reactive, ref } from 'vue'

import type { GRailItem } from '@/components/g/GRail/GRail'

type QualityValue = 'low' | 'medium' | 'high' | 'epic' | 'cinematic'
type MaterialQualityValue = 'low' | 'high'
type PostProcessPresetValue = 'pp0' | 'pp1' | 'pp2' | 'pp3' | 'custom'

type PostProcessSettings = {
  motionBlurQuality: number | null
  blurGBuffer: number | null
  ambientOcclusionLevels: number | null
  ambientOcclusionRadiusScale: number | null
  depthOfFieldQuality: number | null
  renderTargetPoolMin: number | null
  lensFlareQuality: number | null
  sceneColorFringeQuality: number | null
  eyeAdaptationQuality: number | null
  bloomQuality: number | null
  fastBlurThreshold: number | null
  upscaleQuality: number | null
  tonemapperGrainQuantization: number | null
}

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

const postProcessPresetItems: GRailItem[] = [
  { value: 'pp0', title: 'Low', meta: 'Preset 0' },
  { value: 'pp1', title: 'Medium', meta: 'Preset 1' },
  { value: 'pp2', title: 'High', meta: 'Preset 2' },
  { value: 'pp3', title: 'Ultra', meta: 'Preset 3' },
  { value: 'custom', title: 'Custom', meta: 'Manual' },
] as const

const postProcessPresetMap: Record<Exclude<PostProcessPresetValue, 'custom'>, PostProcessSettings> = {
  pp0: {
    motionBlurQuality: 0,
    blurGBuffer: 0,
    ambientOcclusionLevels: 0,
    ambientOcclusionRadiusScale: 1.7,
    depthOfFieldQuality: 0,
    renderTargetPoolMin: 300,
    lensFlareQuality: 0,
    sceneColorFringeQuality: 0,
    eyeAdaptationQuality: 0,
    bloomQuality: 4,
    fastBlurThreshold: 0,
    upscaleQuality: 1,
    tonemapperGrainQuantization: 0,
  },
  pp1: {
    motionBlurQuality: 3,
    blurGBuffer: 0,
    ambientOcclusionLevels: 1,
    ambientOcclusionRadiusScale: 1.7,
    depthOfFieldQuality: 1,
    renderTargetPoolMin: 350,
    lensFlareQuality: 0,
    sceneColorFringeQuality: 0,
    eyeAdaptationQuality: 0,
    bloomQuality: 4,
    fastBlurThreshold: 2,
    upscaleQuality: 2,
    tonemapperGrainQuantization: 0,
  },
  pp2: {
    motionBlurQuality: 3,
    blurGBuffer: -1,
    ambientOcclusionLevels: 2,
    ambientOcclusionRadiusScale: 1.5,
    depthOfFieldQuality: 2,
    renderTargetPoolMin: 400,
    lensFlareQuality: 2,
    sceneColorFringeQuality: 1,
    eyeAdaptationQuality: 2,
    bloomQuality: 5,
    fastBlurThreshold: 3,
    upscaleQuality: 2,
    tonemapperGrainQuantization: 1,
  },
  pp3: {
    motionBlurQuality: 4,
    blurGBuffer: -1,
    ambientOcclusionLevels: 3,
    ambientOcclusionRadiusScale: 1.0,
    depthOfFieldQuality: 2,
    renderTargetPoolMin: 400,
    lensFlareQuality: 2,
    sceneColorFringeQuality: 1,
    eyeAdaptationQuality: 2,
    bloomQuality: 5,
    fastBlurThreshold: 7,
    upscaleQuality: 3,
    tonemapperGrainQuantization: 1,
  },
}

function clonePostProcessSettings(settings: PostProcessSettings): PostProcessSettings {
  return {
    motionBlurQuality: settings.motionBlurQuality,
    blurGBuffer: settings.blurGBuffer,
    ambientOcclusionLevels: settings.ambientOcclusionLevels,
    ambientOcclusionRadiusScale: settings.ambientOcclusionRadiusScale,
    depthOfFieldQuality: settings.depthOfFieldQuality,
    renderTargetPoolMin: settings.renderTargetPoolMin,
    lensFlareQuality: settings.lensFlareQuality,
    sceneColorFringeQuality: settings.sceneColorFringeQuality,
    eyeAdaptationQuality: settings.eyeAdaptationQuality,
    bloomQuality: settings.bloomQuality,
    fastBlurThreshold: settings.fastBlurThreshold,
    upscaleQuality: settings.upscaleQuality,
    tonemapperGrainQuantization: settings.tonemapperGrainQuantization,
  }
}

function matchesPostProcessPreset(
  current: PostProcessSettings,
  preset: PostProcessSettings,
): boolean {
  return (
    current.motionBlurQuality === preset.motionBlurQuality &&
    current.blurGBuffer === preset.blurGBuffer &&
    current.ambientOcclusionLevels === preset.ambientOcclusionLevels &&
    current.ambientOcclusionRadiusScale === preset.ambientOcclusionRadiusScale &&
    current.depthOfFieldQuality === preset.depthOfFieldQuality &&
    current.renderTargetPoolMin === preset.renderTargetPoolMin &&
    current.lensFlareQuality === preset.lensFlareQuality &&
    current.sceneColorFringeQuality === preset.sceneColorFringeQuality &&
    current.eyeAdaptationQuality === preset.eyeAdaptationQuality &&
    current.bloomQuality === preset.bloomQuality &&
    current.fastBlurThreshold === preset.fastBlurThreshold &&
    current.upscaleQuality === preset.upscaleQuality &&
    current.tonemapperGrainQuantization === preset.tonemapperGrainQuantization
  )
}

export default defineComponent({
  name: 'GraphicsSettingsSubview',
  setup() {
    const resolutionScale = ref<number | null>(100)
    const viewDistanceQuality = ref<QualityValue>('high')
    const antiAliasingQuality = ref<QualityValue>('high')
    const materialQualityLevel = ref<MaterialQualityValue>('high')

    const postProcessSettings = reactive<PostProcessSettings>(clonePostProcessSettings(postProcessPresetMap.pp2))
    const postProcessPreset = ref<PostProcessPresetValue>('pp2')
    const postProcessCustomOpen = computed(() => postProcessPreset.value === 'custom')

    const derivedPostProcessPreset = computed<PostProcessPresetValue>(() => {
      const matchedPreset = (Object.entries(postProcessPresetMap) as Array<
        [Exclude<PostProcessPresetValue, 'custom'>, PostProcessSettings]
      >).find(([, preset]) => matchesPostProcessPreset(postProcessSettings, preset))

      return matchedPreset?.[0] ?? 'custom'
    })

    function syncPostProcessPreset(): void {
      postProcessPreset.value = derivedPostProcessPreset.value
    }

    function applyPostProcessPreset(nextPreset: PostProcessPresetValue): void {
      if (nextPreset === 'custom') {
        postProcessPreset.value = 'custom'
        return
      }

      Object.assign(postProcessSettings, clonePostProcessSettings(postProcessPresetMap[nextPreset]))
      postProcessPreset.value = nextPreset
    }

    function onPostProcessPresetChange(value: string | number | boolean | null): void {
      if (
        value === 'pp0' ||
        value === 'pp1' ||
        value === 'pp2' ||
        value === 'pp3' ||
        value === 'custom'
      ) {
        applyPostProcessPreset(value)
      }
    }

    function updatePostProcessSetting<Key extends keyof PostProcessSettings>(
      key: Key,
      value: PostProcessSettings[Key],
    ): void {
      postProcessSettings[key] = value
      syncPostProcessPreset()
    }

    return {
      antiAliasingQuality,
      applyPostProcessPreset,
      materialQualityItems,
      materialQualityLevel,
      onPostProcessPresetChange,
      postProcessCustomOpen,
      postProcessPreset,
      postProcessPresetItems,
      postProcessSettings,
      resolutionScale,
      scalabilityItems,
      updatePostProcessSetting,
      viewDistanceQuality,
    }
  },
})
