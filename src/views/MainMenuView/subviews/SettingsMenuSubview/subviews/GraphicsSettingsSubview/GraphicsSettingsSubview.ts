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

type ShadowPresetValue = 'shadow0' | 'shadow1' | 'shadow2' | 'shadow3' | 'custom'

type ShadowSettings = {
  lightFunctionQuality: number | null
  shadowQuality: number | null
  shadowCsmMaxCascades: number | null
  shadowMaxResolution: number | null
  shadowRadiusThreshold: number | null
  shadowDistanceScale: number | null
  shadowCsmTransitionScale: number | null
}

type TexturePresetValue = 'texture0' | 'texture1' | 'texture2' | 'texture3' | 'custom'

type TextureSettings = {
  streamingMipBias: number | null
  maxAnisotropy: number | null
  streamingPoolSize: number | null
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

const shadowPresetItems: GRailItem[] = [
  { value: 'shadow0', title: 'Low', meta: 'Preset 0' },
  { value: 'shadow1', title: 'Medium', meta: 'Preset 1' },
  { value: 'shadow2', title: 'High', meta: 'Preset 2' },
  { value: 'shadow3', title: 'Ultra', meta: 'Preset 3' },
  { value: 'custom', title: 'Custom', meta: 'Manual' },
] as const

const shadowPresetMap: Record<Exclude<ShadowPresetValue, 'custom'>, ShadowSettings> = {
  shadow0: {
    lightFunctionQuality: 0,
    shadowQuality: 0,
    shadowCsmMaxCascades: 1,
    shadowMaxResolution: 512,
    shadowRadiusThreshold: 0.06,
    shadowDistanceScale: 0.6,
    shadowCsmTransitionScale: 0,
  },
  shadow1: {
    lightFunctionQuality: 1,
    shadowQuality: 2,
    shadowCsmMaxCascades: 1,
    shadowMaxResolution: 1024,
    shadowRadiusThreshold: 0.05,
    shadowDistanceScale: 0.7,
    shadowCsmTransitionScale: 0.25,
  },
  shadow2: {
    lightFunctionQuality: 1,
    shadowQuality: 5,
    shadowCsmMaxCascades: 2,
    shadowMaxResolution: 1024,
    shadowRadiusThreshold: 0.04,
    shadowDistanceScale: 0.85,
    shadowCsmTransitionScale: 0.8,
  },
  shadow3: {
    lightFunctionQuality: 1,
    shadowQuality: 5,
    shadowCsmMaxCascades: 4,
    shadowMaxResolution: 1024,
    shadowRadiusThreshold: 0.03,
    shadowDistanceScale: 1.0,
    shadowCsmTransitionScale: 1.0,
  },
}

const texturePresetItems: GRailItem[] = [
  { value: 'texture0', title: 'Low', meta: 'Aggressive streaming' },
  { value: 'texture1', title: 'Medium', meta: 'Budget clarity' },
  { value: 'texture2', title: 'High', meta: 'Sharp balance' },
  { value: 'texture3', title: 'Ultra', meta: 'Full pool detail' },
  { value: 'custom', title: 'Custom', meta: 'Manual tuning' },
] as const

const texturePresetMap: Record<Exclude<TexturePresetValue, 'custom'>, TextureSettings> = {
  texture0: {
    streamingMipBias: 2.5,
    maxAnisotropy: 0,
    streamingPoolSize: 200,
  },
  texture1: {
    streamingMipBias: 1,
    maxAnisotropy: 2,
    streamingPoolSize: 400,
  },
  texture2: {
    streamingMipBias: 0,
    maxAnisotropy: 4,
    streamingPoolSize: 700,
  },
  texture3: {
    streamingMipBias: 0,
    maxAnisotropy: 8,
    streamingPoolSize: 1000,
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

function cloneShadowSettings(settings: ShadowSettings): ShadowSettings {
  return {
    lightFunctionQuality: settings.lightFunctionQuality,
    shadowQuality: settings.shadowQuality,
    shadowCsmMaxCascades: settings.shadowCsmMaxCascades,
    shadowMaxResolution: settings.shadowMaxResolution,
    shadowRadiusThreshold: settings.shadowRadiusThreshold,
    shadowDistanceScale: settings.shadowDistanceScale,
    shadowCsmTransitionScale: settings.shadowCsmTransitionScale,
  }
}

function cloneTextureSettings(settings: TextureSettings): TextureSettings {
  return {
    streamingMipBias: settings.streamingMipBias,
    maxAnisotropy: settings.maxAnisotropy,
    streamingPoolSize: settings.streamingPoolSize,
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

function matchesShadowPreset(current: ShadowSettings, preset: ShadowSettings): boolean {
  return (
    current.lightFunctionQuality === preset.lightFunctionQuality &&
    current.shadowQuality === preset.shadowQuality &&
    current.shadowCsmMaxCascades === preset.shadowCsmMaxCascades &&
    current.shadowMaxResolution === preset.shadowMaxResolution &&
    current.shadowRadiusThreshold === preset.shadowRadiusThreshold &&
    current.shadowDistanceScale === preset.shadowDistanceScale &&
    current.shadowCsmTransitionScale === preset.shadowCsmTransitionScale
  )
}

function matchesTexturePreset(current: TextureSettings, preset: TextureSettings): boolean {
  return (
    current.streamingMipBias === preset.streamingMipBias &&
    current.maxAnisotropy === preset.maxAnisotropy &&
    current.streamingPoolSize === preset.streamingPoolSize
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
    const postProcessCustomOpen = ref(false)
    const shadowSettings = reactive<ShadowSettings>(cloneShadowSettings(shadowPresetMap.shadow2))
    const shadowPreset = ref<ShadowPresetValue>('shadow2')
    const shadowCustomOpen = ref(false)
    const textureSettings = reactive<TextureSettings>(cloneTextureSettings(texturePresetMap.texture2))
    const texturePreset = ref<TexturePresetValue>('texture2')
    const textureCustomOpen = ref(false)

    const derivedPostProcessPreset = computed<PostProcessPresetValue>(() => {
      const matchedPreset = (Object.entries(postProcessPresetMap) as Array<
        [Exclude<PostProcessPresetValue, 'custom'>, PostProcessSettings]
      >).find(([, preset]) => matchesPostProcessPreset(postProcessSettings, preset))

      return matchedPreset?.[0] ?? 'custom'
    })
    const derivedShadowPreset = computed<ShadowPresetValue>(() => {
      const matchedPreset = (Object.entries(shadowPresetMap) as Array<
        [Exclude<ShadowPresetValue, 'custom'>, ShadowSettings]
      >).find(([, preset]) => matchesShadowPreset(shadowSettings, preset))

      return matchedPreset?.[0] ?? 'custom'
    })
    const derivedTexturePreset = computed<TexturePresetValue>(() => {
      const matchedPreset = (Object.entries(texturePresetMap) as Array<
        [Exclude<TexturePresetValue, 'custom'>, TextureSettings]
      >).find(([, preset]) => matchesTexturePreset(textureSettings, preset))

      return matchedPreset?.[0] ?? 'custom'
    })

    function syncPostProcessPreset(): void {
      postProcessPreset.value = derivedPostProcessPreset.value
    }

    function syncShadowPreset(): void {
      shadowPreset.value = derivedShadowPreset.value
    }

    function syncTexturePreset(): void {
      texturePreset.value = derivedTexturePreset.value
    }

    function applyPostProcessPreset(nextPreset: PostProcessPresetValue): void {
      if (nextPreset === 'custom') {
        postProcessCustomOpen.value = true
        return
      }

      Object.assign(postProcessSettings, clonePostProcessSettings(postProcessPresetMap[nextPreset]))
      postProcessPreset.value = nextPreset
    }

    function applyShadowPreset(nextPreset: ShadowPresetValue): void {
      if (nextPreset === 'custom') {
        shadowCustomOpen.value = true
        return
      }

      Object.assign(shadowSettings, cloneShadowSettings(shadowPresetMap[nextPreset]))
      shadowPreset.value = nextPreset
    }

    function applyTexturePreset(nextPreset: TexturePresetValue): void {
      if (nextPreset === 'custom') {
        textureCustomOpen.value = true
        return
      }

      Object.assign(textureSettings, cloneTextureSettings(texturePresetMap[nextPreset]))
      texturePreset.value = nextPreset
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

    function onShadowPresetChange(value: string | number | boolean | null): void {
      if (
        value === 'shadow0' ||
        value === 'shadow1' ||
        value === 'shadow2' ||
        value === 'shadow3' ||
        value === 'custom'
      ) {
        applyShadowPreset(value)
      }
    }

    function onTexturePresetChange(value: string | number | boolean | null): void {
      if (
        value === 'texture0' ||
        value === 'texture1' ||
        value === 'texture2' ||
        value === 'texture3' ||
        value === 'custom'
      ) {
        applyTexturePreset(value)
      }
    }

    function updatePostProcessSetting<Key extends keyof PostProcessSettings>(
      key: Key,
      value: PostProcessSettings[Key],
    ): void {
      postProcessSettings[key] = value
      syncPostProcessPreset()
    }

    function updateShadowSetting<Key extends keyof ShadowSettings>(
      key: Key,
      value: ShadowSettings[Key],
    ): void {
      shadowSettings[key] = value
      syncShadowPreset()
    }

    function updateTextureSetting<Key extends keyof TextureSettings>(
      key: Key,
      value: TextureSettings[Key],
    ): void {
      textureSettings[key] = value
      syncTexturePreset()
    }

    function togglePostProcessCustomOpen(): void {
      postProcessCustomOpen.value = !postProcessCustomOpen.value
    }

    function toggleShadowCustomOpen(): void {
      shadowCustomOpen.value = !shadowCustomOpen.value
    }

    function toggleTextureCustomOpen(): void {
      textureCustomOpen.value = !textureCustomOpen.value
    }

    return {
      antiAliasingQuality,
      applyPostProcessPreset,
      applyShadowPreset,
      applyTexturePreset,
      materialQualityItems,
      materialQualityLevel,
      onPostProcessPresetChange,
      onShadowPresetChange,
      onTexturePresetChange,
      postProcessCustomOpen,
      postProcessPreset,
      postProcessPresetItems,
      postProcessSettings,
      resolutionScale,
      scalabilityItems,
      shadowCustomOpen,
      shadowPreset,
      shadowPresetItems,
      shadowSettings,
      textureCustomOpen,
      texturePreset,
      texturePresetItems,
      textureSettings,
      togglePostProcessCustomOpen,
      toggleShadowCustomOpen,
      toggleTextureCustomOpen,
      updatePostProcessSetting,
      updateShadowSetting,
      updateTextureSetting,
      viewDistanceQuality,
    }
  },
})
