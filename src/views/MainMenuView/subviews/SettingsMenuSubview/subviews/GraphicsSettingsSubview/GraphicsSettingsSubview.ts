import { computed, defineComponent, reactive, ref, watch } from 'vue'

import type { GComboOption } from '@/components/g/GCombo/GCombo'
import type { GRailItem } from '@/components/g/GRail/GRail'
import GraphicsNumberOverrideRow from './components/GraphicsNumberOverrideRow.vue'
import GraphicsPresetField from './components/GraphicsPresetField.vue'

type AntiAliasingMethodValue = 'none' | 'fxaa' | 'taa' | 'msaa' | 'tsr' | 'smaa'
type UpscaleModeValue = 'off' | 'dlss' | 'fsr'
type DlssQualityValue = 'dlaa' | 'ultra-performance' | 'performance' | 'balanced' | 'quality' | 'ultra-quality'
type FrameGenerationValue = 'off' | '2x' | '3x' | '4x'
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

type EffectsPresetValue = 'effects0' | 'effects1' | 'effects2' | 'effects3' | 'custom'

type EffectsSettings = {
  translucencyLightingVolumeDim: number | null
  refractionQuality: number | null
  ssr: number | null
  ssrQuality: number | null
  sceneColorFormat: number | null
  detailMode: number | null
  translucencyVolumeBlur: number | null
  effectsMaterialQualityLevel: number | null
}

type OverrideRowConfig<Settings> = {
  key: keyof Settings
  label: string
  cvar: string
  presetValues: string
  ariaLabel: string
  min: number
  max: number
  step: number
  mode?: 'float'
  precision?: number
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

const antiAliasingMethodOptions: GComboOption[] = [
  { value: 'none', label: 'None' },
  { value: 'fxaa', label: 'FXAA' },
  { value: 'taa', label: 'TAA' },
  { value: 'msaa', label: 'MSAA', disabled: true, description: 'Unavailable in this renderer path.' },
  { value: 'tsr', label: 'TSR' },
  { value: 'smaa', label: 'SMAA' },
]

const upscaleModeOptions: GComboOption[] = [
  { value: 'off', label: 'Off' },
  { value: 'dlss', label: 'DLSS' },
  { value: 'fsr', label: 'FSR' },
]

const dlssQualityOptions: GComboOption[] = [
  { value: 'dlaa', label: 'DLAA' },
  { value: 'ultra-quality', label: 'Ultra Quality' },
  { value: 'quality', label: 'Quality' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'performance', label: 'Performance' },
  { value: 'ultra-performance', label: 'Ultra Performance' },
]

const frameGenerationOptions: GComboOption[] = [
  { value: 'off', label: 'Off' },
  { value: '2x', label: '2x' },
  { value: '3x', label: '3x' },
  { value: '4x', label: '4x' },
]

const postProcessPresetItems: GRailItem[] = [
  { value: 'pp0', title: 'Low', meta: 'Minimal effects' },
  { value: 'pp1', title: 'Medium', meta: 'Balanced cleanup' },
  { value: 'pp2', title: 'High', meta: 'Full atmosphere' },
  { value: 'pp3', title: 'Ultra', meta: 'Showcase image' },
  { value: 'custom', title: 'Custom', meta: 'Manual tuning' },
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
  { value: 'shadow0', title: 'Low', meta: 'Near-field only' },
  { value: 'shadow1', title: 'Medium', meta: 'Stable basics' },
  { value: 'shadow2', title: 'High', meta: 'Deeper coverage' },
  { value: 'shadow3', title: 'Ultra', meta: 'Full-range detail' },
  { value: 'custom', title: 'Custom', meta: 'Manual tuning' },
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

const effectsPresetItems: GRailItem[] = [
  { value: 'effects0', title: 'Low', meta: 'Cut-back effects' },
  { value: 'effects1', title: 'Medium', meta: 'Core reactions' },
  { value: 'effects2', title: 'High', meta: 'Full volume pass' },
  { value: 'effects3', title: 'Ultra', meta: 'Expanded response' },
  { value: 'custom', title: 'Custom', meta: 'Manual tuning' },
] as const

const effectsPresetMap: Record<Exclude<EffectsPresetValue, 'custom'>, EffectsSettings> = {
  effects0: {
    translucencyLightingVolumeDim: 24,
    refractionQuality: 0,
    ssr: 0,
    ssrQuality: 0,
    sceneColorFormat: 3,
    detailMode: 0,
    translucencyVolumeBlur: 0,
    effectsMaterialQualityLevel: 0,
  },
  effects1: {
    translucencyLightingVolumeDim: 32,
    refractionQuality: 0,
    ssr: 0,
    ssrQuality: 0,
    sceneColorFormat: 3,
    detailMode: 1,
    translucencyVolumeBlur: 0,
    effectsMaterialQualityLevel: 1,
  },
  effects2: {
    translucencyLightingVolumeDim: 48,
    refractionQuality: 2,
    ssr: 0,
    ssrQuality: 0,
    sceneColorFormat: 3,
    detailMode: 1,
    translucencyVolumeBlur: 1,
    effectsMaterialQualityLevel: 1,
  },
  effects3: {
    translucencyLightingVolumeDim: 64,
    refractionQuality: 2,
    ssr: 1,
    ssrQuality: 1,
    sceneColorFormat: 4,
    detailMode: 2,
    translucencyVolumeBlur: 1,
    effectsMaterialQualityLevel: 1,
  },
}

const postProcessOverrideRows: OverrideRowConfig<PostProcessSettings>[] = [
  { key: 'motionBlurQuality', label: 'Motion Blur Quality', cvar: 'r.MotionBlurQuality', presetValues: '0/3/3/4', ariaLabel: 'Motion blur quality', min: 0, max: 4, step: 1 },
  { key: 'blurGBuffer', label: 'Blur GBuffer', cvar: 'r.BlurGBuffer', presetValues: '0/0/-1/-1', ariaLabel: 'Blur GBuffer', min: -1, max: 1, step: 1 },
  { key: 'ambientOcclusionLevels', label: 'Ambient Occlusion Levels', cvar: 'r.AmbientOcclusionLevels', presetValues: '0/1/2/3', ariaLabel: 'Ambient occlusion levels', min: 0, max: 3, step: 1 },
  { key: 'ambientOcclusionRadiusScale', label: 'AO Radius Scale', cvar: 'r.AmbientOcclusionRadiusScale', presetValues: '1.7/1.7/1.5/1.0', ariaLabel: 'Ambient occlusion radius scale', min: 0.5, max: 2, step: 0.1, mode: 'float', precision: 1 },
  { key: 'depthOfFieldQuality', label: 'Depth Of Field Quality', cvar: 'r.DepthOfFieldQuality', presetValues: '0/1/2/2', ariaLabel: 'Depth of field quality', min: 0, max: 2, step: 1 },
  { key: 'renderTargetPoolMin', label: 'Render Target Pool Min', cvar: 'r.RenderTargetPoolMin', presetValues: '300/350/400/400', ariaLabel: 'Render target pool minimum', min: 300, max: 500, step: 10 },
  { key: 'lensFlareQuality', label: 'Lens Flare Quality', cvar: 'r.LensFlareQuality', presetValues: '0/0/2/2', ariaLabel: 'Lens flare quality', min: 0, max: 2, step: 1 },
  { key: 'sceneColorFringeQuality', label: 'Scene Color Fringe Quality', cvar: 'r.SceneColorFringeQuality', presetValues: '0/0/1/1', ariaLabel: 'Scene color fringe quality', min: 0, max: 1, step: 1 },
  { key: 'eyeAdaptationQuality', label: 'Eye Adaptation Quality', cvar: 'r.EyeAdaptationQuality', presetValues: '0/0/2/2', ariaLabel: 'Eye adaptation quality', min: 0, max: 2, step: 1 },
  { key: 'bloomQuality', label: 'Bloom Quality', cvar: 'r.BloomQuality', presetValues: '4/4/5/5', ariaLabel: 'Bloom quality', min: 4, max: 5, step: 1 },
  { key: 'fastBlurThreshold', label: 'Fast Blur Threshold', cvar: 'r.FastBlurThreshold', presetValues: '0/2/3/7', ariaLabel: 'Fast blur threshold', min: 0, max: 7, step: 1 },
  { key: 'upscaleQuality', label: 'Upscale Quality', cvar: 'r.Upscale.Quality', presetValues: '1/2/2/3', ariaLabel: 'Upscale quality', min: 1, max: 3, step: 1 },
  { key: 'tonemapperGrainQuantization', label: 'Grain Quantization', cvar: 'r.Tonemapper.GrainQuantization', presetValues: '0/0/1/1', ariaLabel: 'Tonemapper grain quantization', min: 0, max: 1, step: 1 },
]

const shadowOverrideRows: OverrideRowConfig<ShadowSettings>[] = [
  { key: 'lightFunctionQuality', label: 'Light Function Quality', cvar: 'r.LightFunctionQuality', presetValues: '0/1/1/1', ariaLabel: 'Light function quality', min: 0, max: 1, step: 1 },
  { key: 'shadowQuality', label: 'Shadow Quality', cvar: 'r.ShadowQuality', presetValues: '0/2/5/5', ariaLabel: 'Shadow quality override', min: 0, max: 5, step: 1 },
  { key: 'shadowCsmMaxCascades', label: 'CSM Max Cascades', cvar: 'r.Shadow.CSM.MaxCascades', presetValues: '1/1/2/4', ariaLabel: 'Shadow CSM max cascades', min: 1, max: 4, step: 1 },
  { key: 'shadowMaxResolution', label: 'Max Resolution', cvar: 'r.Shadow.MaxResolution', presetValues: '512/1024/1024/1024', ariaLabel: 'Shadow max resolution', min: 512, max: 2048, step: 128 },
  { key: 'shadowRadiusThreshold', label: 'Radius Threshold', cvar: 'r.Shadow.RadiusThreshold', presetValues: '0.06/0.05/0.04/0.03', ariaLabel: 'Shadow radius threshold', min: 0.01, max: 0.1, step: 0.01, mode: 'float', precision: 2 },
  { key: 'shadowDistanceScale', label: 'Distance Scale', cvar: 'r.Shadow.DistanceScale', presetValues: '0.6/0.7/0.85/1.0', ariaLabel: 'Shadow distance scale', min: 0.5, max: 1.5, step: 0.05, mode: 'float', precision: 2 },
  { key: 'shadowCsmTransitionScale', label: 'CSM Transition Scale', cvar: 'r.Shadow.CSM.TransitionScale', presetValues: '0/0.25/0.8/1.0', ariaLabel: 'Shadow CSM transition scale', min: 0, max: 1.5, step: 0.05, mode: 'float', precision: 2 },
]

const textureOverrideRows: OverrideRowConfig<TextureSettings>[] = [
  { key: 'streamingMipBias', label: 'Mip Bias', cvar: 'r.Streaming.MipBias', presetValues: '2.5/1/0/0', ariaLabel: 'Texture streaming mip bias', min: 0, max: 3, step: 0.1, mode: 'float', precision: 1 },
  { key: 'maxAnisotropy', label: 'Max Anisotropy', cvar: 'r.MaxAnisotropy', presetValues: '0/2/4/8', ariaLabel: 'Texture max anisotropy', min: 0, max: 16, step: 1 },
  { key: 'streamingPoolSize', label: 'Streaming Pool Size', cvar: 'r.Streaming.PoolSize', presetValues: '200/400/700/1000', ariaLabel: 'Texture streaming pool size', min: 200, max: 2000, step: 50 },
]

const effectsOverrideRows: OverrideRowConfig<EffectsSettings>[] = [
  { key: 'translucencyLightingVolumeDim', label: 'Translucency Volume Dim', cvar: 'r.TranslucencyLightingVolumeDim', presetValues: '24/32/48/64', ariaLabel: 'Translucency lighting volume dimension', min: 16, max: 96, step: 8 },
  { key: 'refractionQuality', label: 'Refraction Quality', cvar: 'r.RefractionQuality', presetValues: '0/0/2/2', ariaLabel: 'Refraction quality', min: 0, max: 2, step: 1 },
  { key: 'ssr', label: 'Screen Space Reflections', cvar: 'r.SSR', presetValues: '0/0/0/1', ariaLabel: 'Screen space reflections enable', min: 0, max: 1, step: 1 },
  { key: 'ssrQuality', label: 'SSR Quality', cvar: 'r.SSR.Quality', presetValues: '0/0/0/1', ariaLabel: 'Screen space reflections quality', min: 0, max: 4, step: 1 },
  { key: 'sceneColorFormat', label: 'Scene Color Format', cvar: 'r.SceneColorFormat', presetValues: '3/3/3/4', ariaLabel: 'Scene color format', min: 3, max: 5, step: 1 },
  { key: 'detailMode', label: 'Detail Mode', cvar: 'r.DetailMode', presetValues: '0/1/1/2', ariaLabel: 'Detail mode', min: 0, max: 2, step: 1 },
  { key: 'translucencyVolumeBlur', label: 'Translucency Blur', cvar: 'r.TranslucencyVolumeBlur', presetValues: '0/0/1/1', ariaLabel: 'Translucency volume blur', min: 0, max: 1, step: 1 },
  { key: 'effectsMaterialQualityLevel', label: 'Material Quality Level', cvar: 'r.MaterialQualityLevel', presetValues: '0/1/1/1', ariaLabel: 'Effects material quality level', min: 0, max: 1, step: 1 },
]

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

function cloneEffectsSettings(settings: EffectsSettings): EffectsSettings {
  return {
    translucencyLightingVolumeDim: settings.translucencyLightingVolumeDim,
    refractionQuality: settings.refractionQuality,
    ssr: settings.ssr,
    ssrQuality: settings.ssrQuality,
    sceneColorFormat: settings.sceneColorFormat,
    detailMode: settings.detailMode,
    translucencyVolumeBlur: settings.translucencyVolumeBlur,
    effectsMaterialQualityLevel: settings.effectsMaterialQualityLevel,
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

function matchesEffectsPreset(current: EffectsSettings, preset: EffectsSettings): boolean {
  return (
    current.translucencyLightingVolumeDim === preset.translucencyLightingVolumeDim &&
    current.refractionQuality === preset.refractionQuality &&
    current.ssr === preset.ssr &&
    current.ssrQuality === preset.ssrQuality &&
    current.sceneColorFormat === preset.sceneColorFormat &&
    current.detailMode === preset.detailMode &&
    current.translucencyVolumeBlur === preset.translucencyVolumeBlur &&
    current.effectsMaterialQualityLevel === preset.effectsMaterialQualityLevel
  )
}

export default defineComponent({
  name: 'GraphicsSettingsSubview',
  components: {
    GraphicsNumberOverrideRow,
    GraphicsPresetField,
  },
  setup() {
    const antiAliasingMethod = ref<AntiAliasingMethodValue>('tsr')
    const upscaleMode = ref<UpscaleModeValue>('off')
    const dlssQuality = ref<DlssQualityValue>('quality')
    const frameGeneration = ref<FrameGenerationValue>('off')
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
    const effectsSettings = reactive<EffectsSettings>(cloneEffectsSettings(effectsPresetMap.effects2))
    const effectsPreset = ref<EffectsPresetValue>('effects2')
    const effectsCustomOpen = ref(false)
    const antiAliasingMethodLocked = computed(
      () => upscaleMode.value !== 'off' || frameGeneration.value !== 'off'
    )
    const upscaleQualityDisabled = computed(() => upscaleMode.value === 'off')
    const upscaleQualityOptions = computed(() =>
      upscaleMode.value === 'fsr'
        ? dlssQualityOptions.filter((option) => option.value !== 'dlaa')
        : dlssQualityOptions
    )
    const hoverHelpDelay = 600

    const graphicsHelp = {
      resolutionScale:
        'Example values: 100% for native resolution, 85% for a lighter performance pass, or 67% if you need a strong frame-rate boost.',
      antiAliasingMethod:
        'Choose how the image is smoothed. TAA is the safest default, FXAA is lighter, and TSR helps when the game is rendering below native resolution.',
      method:
        'If an upscaler or frame generation is active, this is locked to TAA to keep the image stable.',
      frameGeneration:
        'Example choices: Off for lowest latency, 2x for a balanced boost, or 3x and 4x on supported hardware if you want higher frame rates.',
      upscaleMode:
        'Use an upscaler when you want more performance. Off keeps the image native; DLSS and FSR trade a bit of detail for smoother play.',
      upscaleQuality:
        'Higher quality values keep more detail and usually cost more GPU time. Performance and Ultra Performance lean harder toward frame-rate gains.',
      viewDistanceQuality:
        'Controls how far the world keeps full detail. Lower values help performance in dense scenes; higher values keep distant geometry clearer.',
      antiAliasingQuality:
        'Controls how strongly the renderer smooths edges. Higher values usually look better but may cost a little more performance.',
      materialQualityLevel:
        'Controls how many material features the renderer uses. High keeps the full visual path; Low trims material cost for weaker hardware.',
      postProcessQuality:
        'Includes motion blur, bloom, ambient occlusion, color grading, and similar finishing effects. Custom opens the fine-tuning rows below.',
      shadowQuality:
        'Controls shadow coverage, cascade count, and resolution. Higher levels give deeper, more stable shadows at a higher GPU cost.',
      textureQuality:
        'Controls mip bias, anisotropy, and streaming pool budget. Higher values preserve texture sharpness when viewed at an angle or at distance.',
      effectsQuality:
        'Controls translucency detail, refraction, reflections, and other surface effects. Higher levels make the scene richer but heavier to render.',
    } as const

    watch(
      antiAliasingMethodLocked,
      (locked) => {
        if (locked) {
          antiAliasingMethod.value = 'taa'
        }
      },
      { immediate: true },
    )

    watch(
      upscaleMode,
      (mode) => {
        if (mode === 'fsr' && dlssQuality.value === 'dlaa') {
          dlssQuality.value = 'quality'
        }
      },
      { immediate: true },
    )

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
    const derivedEffectsPreset = computed<EffectsPresetValue>(() => {
      const matchedPreset = (Object.entries(effectsPresetMap) as Array<
        [Exclude<EffectsPresetValue, 'custom'>, EffectsSettings]
      >).find(([, preset]) => matchesEffectsPreset(effectsSettings, preset))

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

    function syncEffectsPreset(): void {
      effectsPreset.value = derivedEffectsPreset.value
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

    function applyEffectsPreset(nextPreset: EffectsPresetValue): void {
      if (nextPreset === 'custom') {
        effectsCustomOpen.value = true
        return
      }

      Object.assign(effectsSettings, cloneEffectsSettings(effectsPresetMap[nextPreset]))
      effectsPreset.value = nextPreset
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

    function onEffectsPresetChange(value: string | number | boolean | null): void {
      if (
        value === 'effects0' ||
        value === 'effects1' ||
        value === 'effects2' ||
        value === 'effects3' ||
        value === 'custom'
      ) {
        applyEffectsPreset(value)
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

    function updateEffectsSetting<Key extends keyof EffectsSettings>(
      key: Key,
      value: EffectsSettings[Key],
    ): void {
      effectsSettings[key] = value
      syncEffectsPreset()
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

    function toggleEffectsCustomOpen(): void {
      effectsCustomOpen.value = !effectsCustomOpen.value
    }

    return {
      antiAliasingMethod,
      antiAliasingMethodOptions,
      antiAliasingMethodLocked,
      antiAliasingQuality,
      graphicsHelp,
      dlssQuality,
      hoverHelpDelay,
      upscaleMode,
      upscaleModeOptions,
      upscaleQualityDisabled,
      upscaleQualityOptions,
      applyPostProcessPreset,
      applyShadowPreset,
      applyTexturePreset,
      applyEffectsPreset,
      effectsCustomOpen,
      effectsPreset,
      effectsPresetItems,
      effectsSettings,
      effectsOverrideRows,
      materialQualityItems,
      materialQualityLevel,
      onEffectsPresetChange,
      onPostProcessPresetChange,
      onShadowPresetChange,
      onTexturePresetChange,
      postProcessCustomOpen,
      postProcessPreset,
      postProcessPresetItems,
      postProcessSettings,
      postProcessOverrideRows,
      frameGeneration,
      frameGenerationOptions,
      resolutionScale,
      scalabilityItems,
      shadowCustomOpen,
      shadowPreset,
      shadowPresetItems,
      shadowSettings,
      shadowOverrideRows,
      textureCustomOpen,
      texturePreset,
      texturePresetItems,
      textureSettings,
      textureOverrideRows,
      toggleEffectsCustomOpen,
      togglePostProcessCustomOpen,
      toggleShadowCustomOpen,
      toggleTextureCustomOpen,
      updateEffectsSetting,
      updatePostProcessSetting,
      updateShadowSetting,
      updateTextureSetting,
      viewDistanceQuality,
    }
  },
})
