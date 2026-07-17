import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'

import type { GComboOption } from '@/components/g/GCombo/GCombo'
import { ColorGamut, HdrOutput } from '@/proto/gen/display_settings'

export type FullscreenMode = 'fullscreen' | 'borderless' | 'windowed'
export type AudioTalkMode = 'push-to-talk' | 'voice-activation'
export type AntiAliasingMethodValue = 'none' | 'fxaa' | 'taa' | 'msaa' | 'tsr' | 'smaa'
export type UpscaleModeValue = 'off' | 'dlss' | 'fsr'
export type DlssQualityValue =
  | 'dlaa'
  | 'ultra-performance'
  | 'performance'
  | 'balanced'
  | 'quality'
  | 'ultra-quality'
export type FrameGenerationValue = 'off' | '2x' | '3x' | '4x'
export type QualityValue = 'low' | 'medium' | 'high' | 'epic' | 'cinematic'
export type MaterialQualityValue = 'low' | 'high'
export type PostProcessPresetValue = 'pp0' | 'pp1' | 'pp2' | 'pp3' | 'custom'
export type ShadowPresetValue = 'shadow0' | 'shadow1' | 'shadow2' | 'shadow3' | 'custom'
export type TexturePresetValue = 'texture0' | 'texture1' | 'texture2' | 'texture3' | 'custom'
export type EffectsPresetValue = 'effects0' | 'effects1' | 'effects2' | 'effects3' | 'custom'
export type SettingsSectionLoadState = 'idle' | 'loading' | 'loaded'

export type PostProcessSettings = {
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

export type ShadowSettings = {
  lightFunctionQuality: number | null
  shadowQuality: number | null
  shadowCsmMaxCascades: number | null
  shadowMaxResolution: number | null
  shadowRadiusThreshold: number | null
  shadowDistanceScale: number | null
  shadowCsmTransitionScale: number | null
}

export type TextureSettings = {
  streamingMipBias: number | null
  maxAnisotropy: number | null
  streamingPoolSize: number | null
}

export type EffectsSettings = {
  translucencyLightingVolumeDim: number | null
  refractionQuality: number | null
  ssr: number | null
  ssrQuality: number | null
  sceneColorFormat: number | null
  detailMode: number | null
  translucencyVolumeBlur: number | null
  effectsMaterialQualityLevel: number | null
}

const SETTINGS_STORAGE_KEY = 'scp-front:settings:v1'

type PersistedSettingsState = {
  display: {
    fullscreenMode: FullscreenMode
    resolution: string | number | null
    resolutionOptions: GComboOption[]
    vsync: boolean
    limitFps: boolean
    maxFps: number | null
    hdrEnabled: boolean
    hdrOutputDevice: HdrOutput | null
    hdrColorGamut: ColorGamut | null
    brightness: number | null
    gamma: number | null
    contrast: number | null
    fov: number | null
    cameraSmoothing: number | null
    screenShakeIntensity: number | null
    headBobbingIntensity: number | null
  }
  graphics: {
    antiAliasingMethod: AntiAliasingMethodValue
    upscaleMode: UpscaleModeValue
    dlssQuality: DlssQualityValue
    frameGeneration: FrameGenerationValue
    resolutionScale: number | null
    viewDistanceQuality: QualityValue
    antiAliasingQuality: QualityValue
    materialQualityLevel: MaterialQualityValue
    postProcessSettings: PostProcessSettings
    postProcessPreset: PostProcessPresetValue
    postProcessCustomOpen: boolean
    shadowSettings: ShadowSettings
    shadowPreset: ShadowPresetValue
    shadowCustomOpen: boolean
    textureSettings: TextureSettings
    texturePreset: TexturePresetValue
    textureCustomOpen: boolean
    effectsSettings: EffectsSettings
    effectsPreset: EffectsPresetValue
    effectsCustomOpen: boolean
  }
  audio: {
    outputDevice: string | number | null
    outputDeviceOptions: GComboOption[]
    inputDevice: string | number | null
    inputDeviceOptions: GComboOption[]
    talkMode: AudioTalkMode
    voiceActivationThreshold: number | null
    masterVolume: number | null
    sfxVolume: number | null
    uiVolume: number | null
    musicVolume: number | null
    voiceVolume: number | null
    ambientVolume: number | null
  }
  controls: {
    mouseSensitivity: number | null
    invertYAxis: boolean
    holdToSprint: boolean
    holdToCrouch: boolean
    holdToSelectItem: boolean
    autoSwitchNewItemPickedUp: boolean
    holdToSeeInventory: boolean
  }
}

function createDefaultPersistedSettingsState(): PersistedSettingsState {
  return {
    display: {
      fullscreenMode: 'fullscreen',
      resolution: null,
      resolutionOptions: [],
      vsync: false,
      limitFps: false,
      maxFps: null,
      hdrEnabled: false,
      hdrOutputDevice: null,
      hdrColorGamut: null,
      brightness: null,
      gamma: null,
      contrast: null,
      fov: null,
      cameraSmoothing: null,
      screenShakeIntensity: null,
      headBobbingIntensity: null,
    },
    graphics: {
      antiAliasingMethod: 'tsr',
      upscaleMode: 'off',
      dlssQuality: 'quality',
      frameGeneration: 'off',
      resolutionScale: 100,
      viewDistanceQuality: 'high',
      antiAliasingQuality: 'high',
      materialQualityLevel: 'high',
      postProcessSettings: {
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
      postProcessPreset: 'pp2',
      postProcessCustomOpen: false,
      shadowSettings: {
        lightFunctionQuality: 1,
        shadowQuality: 5,
        shadowCsmMaxCascades: 2,
        shadowMaxResolution: 1024,
        shadowRadiusThreshold: 0.04,
        shadowDistanceScale: 0.85,
        shadowCsmTransitionScale: 0.8,
      },
      shadowPreset: 'shadow2',
      shadowCustomOpen: false,
      textureSettings: {
        streamingMipBias: 0,
        maxAnisotropy: 4,
        streamingPoolSize: 700,
      },
      texturePreset: 'texture2',
      textureCustomOpen: false,
      effectsSettings: {
        translucencyLightingVolumeDim: 48,
        refractionQuality: 2,
        ssr: 0,
        ssrQuality: 0,
        sceneColorFormat: 3,
        detailMode: 1,
        translucencyVolumeBlur: 1,
        effectsMaterialQualityLevel: 1,
      },
      effectsPreset: 'effects2',
      effectsCustomOpen: false,
    },
    audio: {
      outputDevice: 'headphones-usb',
      outputDeviceOptions: [],
      inputDevice: 'headset-mic',
      inputDeviceOptions: [],
      talkMode: 'push-to-talk',
      voiceActivationThreshold: 55,
      masterVolume: 80,
      sfxVolume: 85,
      uiVolume: 70,
      musicVolume: 45,
      voiceVolume: 90,
      ambientVolume: 65,
    },
    controls: {
      mouseSensitivity: 123.123,
      invertYAxis: false,
      holdToSprint: true,
      holdToCrouch: false,
      holdToSelectItem: false,
      autoSwitchNewItemPickedUp: true,
      holdToSeeInventory: false,
    },
  }
}

function clonePersistedSettingsState(state: PersistedSettingsState): PersistedSettingsState {
  return JSON.parse(JSON.stringify(state)) as PersistedSettingsState
}

function loadPersistedSettingsState(): PersistedSettingsState {
  const fallback = createDefaultPersistedSettingsState()

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as Partial<PersistedSettingsState>
    return {
      display: {
        ...fallback.display,
        ...parsed.display,
        resolutionOptions: parsed.display?.resolutionOptions ?? fallback.display.resolutionOptions,
      },
      graphics: {
        ...fallback.graphics,
        ...parsed.graphics,
        postProcessSettings: {
          ...fallback.graphics.postProcessSettings,
          ...parsed.graphics?.postProcessSettings,
        },
        shadowSettings: {
          ...fallback.graphics.shadowSettings,
          ...parsed.graphics?.shadowSettings,
        },
        textureSettings: {
          ...fallback.graphics.textureSettings,
          ...parsed.graphics?.textureSettings,
        },
        effectsSettings: {
          ...fallback.graphics.effectsSettings,
          ...parsed.graphics?.effectsSettings,
        },
      },
      audio: {
        ...fallback.audio,
        ...parsed.audio,
        outputDeviceOptions: parsed.audio?.outputDeviceOptions ?? fallback.audio.outputDeviceOptions,
        inputDeviceOptions: parsed.audio?.inputDeviceOptions ?? fallback.audio.inputDeviceOptions,
      },
      controls: {
        ...fallback.controls,
        ...parsed.controls,
      },
    }
  } catch (error) {
    console.warn('[settings-store] failed to load persisted settings', error)
    return fallback
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const initialState = loadPersistedSettingsState()

  const fullscreenMode = ref<FullscreenMode>(initialState.display.fullscreenMode)
  const resolution = ref<string | number | null>(initialState.display.resolution)
  const resolutionOptions = ref<GComboOption[]>(initialState.display.resolutionOptions)
  const vsync = ref(initialState.display.vsync)
  const limitFps = ref(initialState.display.limitFps)
  const maxFps = ref<number | null>(initialState.display.maxFps)
  const hdrEnabled = ref(initialState.display.hdrEnabled)
  const hdrOutputDevice = ref<HdrOutput | null>(initialState.display.hdrOutputDevice)
  const hdrColorGamut = ref<ColorGamut | null>(initialState.display.hdrColorGamut)
  const brightness = ref<number | null>(initialState.display.brightness)
  const gamma = ref<number | null>(initialState.display.gamma)
  const contrast = ref<number | null>(initialState.display.contrast)
  const fov = ref<number | null>(initialState.display.fov)
  const cameraSmoothing = ref<number | null>(initialState.display.cameraSmoothing)
  const screenShakeIntensity = ref<number | null>(initialState.display.screenShakeIntensity)
  const headBobbingIntensity = ref<number | null>(initialState.display.headBobbingIntensity)

  const antiAliasingMethod = ref<AntiAliasingMethodValue>(initialState.graphics.antiAliasingMethod)
  const upscaleMode = ref<UpscaleModeValue>(initialState.graphics.upscaleMode)
  const dlssQuality = ref<DlssQualityValue>(initialState.graphics.dlssQuality)
  const frameGeneration = ref<FrameGenerationValue>(initialState.graphics.frameGeneration)
  const resolutionScale = ref<number | null>(initialState.graphics.resolutionScale)
  const viewDistanceQuality = ref<QualityValue>(initialState.graphics.viewDistanceQuality)
  const antiAliasingQuality = ref<QualityValue>(initialState.graphics.antiAliasingQuality)
  const materialQualityLevel = ref<MaterialQualityValue>(initialState.graphics.materialQualityLevel)
  const postProcessSettings = reactive<PostProcessSettings>({
    ...initialState.graphics.postProcessSettings,
  })
  const postProcessPreset = ref<PostProcessPresetValue>(initialState.graphics.postProcessPreset)
  const postProcessCustomOpen = ref(initialState.graphics.postProcessCustomOpen)
  const shadowSettings = reactive<ShadowSettings>({
    ...initialState.graphics.shadowSettings,
  })
  const shadowPreset = ref<ShadowPresetValue>(initialState.graphics.shadowPreset)
  const shadowCustomOpen = ref(initialState.graphics.shadowCustomOpen)
  const textureSettings = reactive<TextureSettings>({
    ...initialState.graphics.textureSettings,
  })
  const texturePreset = ref<TexturePresetValue>(initialState.graphics.texturePreset)
  const textureCustomOpen = ref(initialState.graphics.textureCustomOpen)
  const effectsSettings = reactive<EffectsSettings>({
    ...initialState.graphics.effectsSettings,
  })
  const effectsPreset = ref<EffectsPresetValue>(initialState.graphics.effectsPreset)
  const effectsCustomOpen = ref(initialState.graphics.effectsCustomOpen)

  const outputDevice = ref<string | number | null>(initialState.audio.outputDevice)
  const outputDeviceOptions = ref<GComboOption[]>(initialState.audio.outputDeviceOptions)
  const inputDevice = ref<string | number | null>(initialState.audio.inputDevice)
  const inputDeviceOptions = ref<GComboOption[]>(initialState.audio.inputDeviceOptions)
  const talkMode = ref<AudioTalkMode>(initialState.audio.talkMode)
  const voiceActivationThreshold = ref<number | null>(initialState.audio.voiceActivationThreshold)
  const masterVolume = ref<number | null>(initialState.audio.masterVolume)
  const sfxVolume = ref<number | null>(initialState.audio.sfxVolume)
  const uiVolume = ref<number | null>(initialState.audio.uiVolume)
  const musicVolume = ref<number | null>(initialState.audio.musicVolume)
  const voiceVolume = ref<number | null>(initialState.audio.voiceVolume)
  const ambientVolume = ref<number | null>(initialState.audio.ambientVolume)

  const mouseSensitivity = ref<number | null>(initialState.controls.mouseSensitivity)
  const invertYAxis = ref(initialState.controls.invertYAxis)
  const holdToSprint = ref(initialState.controls.holdToSprint)
  const holdToCrouch = ref(initialState.controls.holdToCrouch)
  const holdToSelectItem = ref(initialState.controls.holdToSelectItem)
  const autoSwitchNewItemPickedUp = ref(initialState.controls.autoSwitchNewItemPickedUp)
  const holdToSeeInventory = ref(initialState.controls.holdToSeeInventory)
  const displaySettingsLoadState = ref<SettingsSectionLoadState>('idle')
  const graphicsSettingsLoadState = ref<SettingsSectionLoadState>('idle')
  const audioSettingsLoadState = ref<SettingsSectionLoadState>('idle')

  function snapshot(): PersistedSettingsState {
    return clonePersistedSettingsState({
      display: {
        fullscreenMode: fullscreenMode.value,
        resolution: resolution.value,
        resolutionOptions: resolutionOptions.value,
        vsync: vsync.value,
        limitFps: limitFps.value,
        maxFps: maxFps.value,
        hdrEnabled: hdrEnabled.value,
        hdrOutputDevice: hdrOutputDevice.value,
        hdrColorGamut: hdrColorGamut.value,
        brightness: brightness.value,
        gamma: gamma.value,
        contrast: contrast.value,
        fov: fov.value,
        cameraSmoothing: cameraSmoothing.value,
        screenShakeIntensity: screenShakeIntensity.value,
        headBobbingIntensity: headBobbingIntensity.value,
      },
      graphics: {
        antiAliasingMethod: antiAliasingMethod.value,
        upscaleMode: upscaleMode.value,
        dlssQuality: dlssQuality.value,
        frameGeneration: frameGeneration.value,
        resolutionScale: resolutionScale.value,
        viewDistanceQuality: viewDistanceQuality.value,
        antiAliasingQuality: antiAliasingQuality.value,
        materialQualityLevel: materialQualityLevel.value,
        postProcessSettings: { ...postProcessSettings },
        postProcessPreset: postProcessPreset.value,
        postProcessCustomOpen: postProcessCustomOpen.value,
        shadowSettings: { ...shadowSettings },
        shadowPreset: shadowPreset.value,
        shadowCustomOpen: shadowCustomOpen.value,
        textureSettings: { ...textureSettings },
        texturePreset: texturePreset.value,
        textureCustomOpen: textureCustomOpen.value,
        effectsSettings: { ...effectsSettings },
        effectsPreset: effectsPreset.value,
        effectsCustomOpen: effectsCustomOpen.value,
      },
      audio: {
        outputDevice: outputDevice.value,
        outputDeviceOptions: outputDeviceOptions.value,
        inputDevice: inputDevice.value,
        inputDeviceOptions: inputDeviceOptions.value,
        talkMode: talkMode.value,
        voiceActivationThreshold: voiceActivationThreshold.value,
        masterVolume: masterVolume.value,
        sfxVolume: sfxVolume.value,
        uiVolume: uiVolume.value,
        musicVolume: musicVolume.value,
        voiceVolume: voiceVolume.value,
        ambientVolume: ambientVolume.value,
      },
      controls: {
        mouseSensitivity: mouseSensitivity.value,
        invertYAxis: invertYAxis.value,
        holdToSprint: holdToSprint.value,
        holdToCrouch: holdToCrouch.value,
        holdToSelectItem: holdToSelectItem.value,
        autoSwitchNewItemPickedUp: autoSwitchNewItemPickedUp.value,
        holdToSeeInventory: holdToSeeInventory.value,
      },
    })
  }

  watch(
    snapshot,
    (state) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state))
    },
    { deep: true },
  )

  return {
    ambientVolume,
    antiAliasingMethod,
    antiAliasingQuality,
    audioSettingsLoadState,
    autoSwitchNewItemPickedUp,
    brightness,
    cameraSmoothing,
    contrast,
    dlssQuality,
    displaySettingsLoadState,
    effectsCustomOpen,
    effectsPreset,
    effectsSettings,
    fov,
    frameGeneration,
    fullscreenMode,
    gamma,
    graphicsSettingsLoadState,
    hdrColorGamut,
    hdrEnabled,
    hdrOutputDevice,
    headBobbingIntensity,
    holdToCrouch,
    holdToSeeInventory,
    holdToSelectItem,
      holdToSprint,
      inputDevice,
      inputDeviceOptions,
      invertYAxis,
    limitFps,
    masterVolume,
    materialQualityLevel,
    maxFps,
    mouseSensitivity,
    musicVolume,
      outputDevice,
      outputDeviceOptions,
      postProcessCustomOpen,
    postProcessPreset,
    postProcessSettings,
    resolution,
    resolutionOptions,
    resolutionScale,
    screenShakeIntensity,
    sfxVolume,
    shadowCustomOpen,
    shadowPreset,
    shadowSettings,
    talkMode,
    textureCustomOpen,
    texturePreset,
    textureSettings,
    uiVolume,
    upscaleMode,
    viewDistanceQuality,
    voiceActivationThreshold,
    voiceVolume,
    vsync,
  }
})
