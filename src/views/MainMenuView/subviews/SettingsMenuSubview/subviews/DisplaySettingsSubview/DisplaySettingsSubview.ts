import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'

import type { GComboOption } from '@/components/g/GCombo/GCombo'
import {
  ColorGamut,
  DisplaySliderType,
  DisplaySettingRequestType,
  FrameLimitContent,
  FullscreenMode as ProtoFullscreenMode,
  HdrOutput,
  RequestGetDisplaySettings,
  RequestSetDisplaySettings,
  ResponseDisplaySettings,
  type RequestSetDisplaySettings as RequestSetDisplaySettingsShape,
  type ResolutionResponse,
} from '@/proto/gen/display_settings'
import { MessageType } from '@/proto/gen/scp_webui'
import { getScpWebSocketClient } from '@/services'
import { useSettingsStore, type FullscreenMode } from '@/stores/settings'

const fullscreenModes: Array<{ value: FullscreenMode; label: string }> = [
  { value: 'fullscreen', label: 'Fullscreen' },
  { value: 'borderless', label: 'Windowed Fullscreen' },
  { value: 'windowed', label: 'Windowed' },
]

const hdrOutputDeviceOptions: GComboOption[] = [
  { value: HdrOutput.HDR_OUTPUT_SRGB, label: 'sRGB (LDR)' },
  { value: HdrOutput.HDR_OUTPUT_REC, label: 'Rec709 (LDR)' },
  { value: HdrOutput.HDR_OUTPUT_LDR, label: 'Explicit Gamma Mapping (LDR)' },
  { value: HdrOutput.HDR_OUTPUT_ACES_1000, label: 'ACES 1000-nit ST-2084 (Dolby PQ)' },
  { value: HdrOutput.HDR_OUTPUT_ACES_2000, label: 'ACES 2000-nit ST-2084 (Dolby PQ)' },
  { value: HdrOutput.HDR_OUTPUT_ACES_1000_ScRGB, label: 'ACES 1000-nit ScRGB' },
  { value: HdrOutput.HDR_OUTPUT_ACES_2000_ScRGB, label: 'ACES 2000-nit ScRGB' },
]

const hdrColorGamutOptions: GComboOption[] = [
  { value: ColorGamut.HDR_GAMUT_REC_709, label: 'Rec709 / sRGB, D65' },
  { value: ColorGamut.HDR_GAMUT_DCI, label: 'DCI-P3, D65' },
  { value: ColorGamut.HDR_GAMUT_REC_2020, label: 'Rec2020 / BT2020, D65' },
  { value: ColorGamut.HDR_GAMUT_ACES, label: 'ACES, D60' },
  { value: ColorGamut.HDR_GAMUT_ACESsg, label: 'ACEScg, D60' },
]

const displayRequestTypes: DisplaySettingRequestType[] = [
  DisplaySettingRequestType.DISPLAY_SETTING_FULLSCREEN_MODE,
  DisplaySettingRequestType.DISPLAY_SETTING_RESOLUTION,
  DisplaySettingRequestType.DISPLAY_SETTING_VSYNC,
  DisplaySettingRequestType.DISPLAY_SETTING_FRAME_RATE_LIMIT,
  DisplaySettingRequestType.DISPLAY_SETTING_HDR,
  DisplaySettingRequestType.DISPLAY_SETTING_ACCESSIBILITY,
  DisplaySettingRequestType.DISPLAY_SETTING_CAMERA,
]

export const displaySettingsRuntime = reactive({
  showHdrUnsupportedBadge: false,
})

export function setDisplayHdrUnsupportedBadgeVisible(visible: boolean): void {
  displaySettingsRuntime.showHdrUnsupportedBadge = visible
}

export default defineComponent({
  name: 'DisplaySettingsSubview',
  setup() {
    const settingsStore = useSettingsStore()
    const {
      brightness,
      cameraSmoothing,
      contrast,
      fov,
      fullscreenMode,
      gamma,
      hdrColorGamut,
      hdrEnabled,
      hdrOutputDevice,
      headBobbingIntensity,
      limitFps,
      maxFps,
      resolution,
      resolutionOptions,
      screenShakeIntensity,
      vsync,
    } = storeToRefs(settingsStore)

    const resolutionDisabled = computed(() => fullscreenMode.value === 'borderless')
    const fpsControlsDisabled = computed(() => !limitFps.value)
    const hdrToggleDisabled = computed(() => displaySettingsRuntime.showHdrUnsupportedBadge)
    const hdrControlsDisabled = computed(() => !hdrEnabled.value)
    const pendingDisplayRequestTypes = ref<Set<DisplaySettingRequestType>>(new Set(displayRequestTypes))
    const displaySettingsLoaded = computed(() => pendingDisplayRequestTypes.value.size === 0)
    const hoverHelpDelay = 600
    let unsubscribeResponse: (() => void) | null = null
    let unsubscribeState: (() => void) | null = null

    function mapProtoFullscreenMode(mode: ProtoFullscreenMode | undefined): FullscreenMode {
      switch (mode) {
        case ProtoFullscreenMode.FULLSCREEN_MODE_WINDOWED_FULLSCREEN:
          return 'borderless'
        case ProtoFullscreenMode.FULLSCREEN_MODE_WINDOWED:
          return 'windowed'
        case ProtoFullscreenMode.FULLSCREEN_MODE_FULLSCREEN:
        default:
          return 'fullscreen'
      }
    }

    function mapFullscreenMode(mode: FullscreenMode): ProtoFullscreenMode {
      switch (mode) {
        case 'borderless':
          return ProtoFullscreenMode.FULLSCREEN_MODE_WINDOWED_FULLSCREEN
        case 'windowed':
          return ProtoFullscreenMode.FULLSCREEN_MODE_WINDOWED
        case 'fullscreen':
        default:
          return ProtoFullscreenMode.FULLSCREEN_MODE_FULLSCREEN
      }
    }

    function formatResolutionOptionValue(width: number, height: number): string {
      return `${width}x${height}`
    }

    function parseResolutionValue(value: string | number | null): { x: number; y: number } | null {
      if (typeof value !== 'string') {
        return null
      }

      const match = /^(\d+)x(\d+)$/.exec(value)
      if (!match) {
        return null
      }

      const x = Number(match[1])
      const y = Number(match[2])

      if (!Number.isInteger(x) || !Number.isInteger(y)) {
        return null
      }

      return { x, y }
    }

    function sendDisplaySettingsUpdate(message: RequestSetDisplaySettingsShape): void {
      const client = getScpWebSocketClient()

      if (!client || client.connectionState !== 'open') {
        return
      }

      client.sendTypedMessage(
        MessageType.REQUEST_SET_DISPLAY_SETTINGS,
        message,
        RequestSetDisplaySettings,
      )
    }

    function applyFullscreenMode(mode: FullscreenMode): void {
      fullscreenMode.value = mode
      sendDisplaySettingsUpdate({
        fullScreenMode: mapFullscreenMode(mode),
      })
    }

    function applyResolution(value: string | number | null): void {
      resolution.value = value

      const parsed = parseResolutionValue(value)
      if (!parsed) {
        return
      }

      sendDisplaySettingsUpdate({
        resolution: parsed,
      })
    }

    function applyVsync(enabled: boolean): void {
      vsync.value = enabled
      sendDisplaySettingsUpdate({
        vsync: { enabled },
      })
    }

    function applyFrameRateLimit(flag: boolean, limit = maxFps.value): void {
      limitFps.value = flag

      if (typeof limit === 'number') {
        maxFps.value = limit
      }

      sendDisplaySettingsUpdate({
        frameRateLimit: FrameLimitContent.create({
          flag,
          limit: typeof limit === 'number' ? limit : 0,
        }),
      })
    }

    function applyFrameRateLimitToggle(value: boolean): void {
      applyFrameRateLimit(value)
    }

    function applyFrameRateLimitValue(value: number | null): void {
      applyFrameRateLimit(limitFps.value, value)
    }

    function applyHdrEnabled(enabled: boolean): void {
      if (enabled && hdrToggleDisabled.value) {
        hdrEnabled.value = false
        return
      }

      hdrEnabled.value = enabled
      sendDisplaySettingsUpdate({
        hdrEnableFlag: enabled,
      })
    }

    function applyHdrOutputDevice(value: string | number | null): void {
      if (typeof value !== 'number') {
        return
      }

      hdrOutputDevice.value = value
      sendDisplaySettingsUpdate({
        hdrOutputDevice: value,
      })
    }

    function applyHdrColorGamut(value: string | number | null): void {
      if (typeof value !== 'number') {
        return
      }

      hdrColorGamut.value = value
      sendDisplaySettingsUpdate({
        hdrColorGamut: value,
      })
    }

    function applyDisplaySlider(sliderType: DisplaySliderType, value: number | null): void {
      if (typeof value !== 'number') {
        return
      }

      sendDisplaySettingsUpdate({
        displaySlider: {
          sliderType,
          value,
        },
      })
    }

    function applyResolutionResponse(payload: ResolutionResponse | undefined): void {
      if (!payload) {
        resolutionOptions.value = []
        resolution.value = null
        return
      }

      const options = payload.resolutions.map((entry) => ({
        value: formatResolutionOptionValue(entry.x, entry.y),
        label: `${entry.x} x ${entry.y}`,
      }))

      resolutionOptions.value = options
      resolution.value =
        options[payload.selectedIndex]?.value ?? options[0]?.value ?? null
    }

    function applyDisplayResponse(message: ResponseDisplaySettings): void {
      pendingDisplayRequestTypes.value.delete(message.requestedType)

      switch (message.requestedType) {
        case DisplaySettingRequestType.DISPLAY_SETTING_FULLSCREEN_MODE:
          fullscreenMode.value = mapProtoFullscreenMode(message.fullScreenMode)
          return
        case DisplaySettingRequestType.DISPLAY_SETTING_RESOLUTION:
          applyResolutionResponse(message.resolution)
          return
        case DisplaySettingRequestType.DISPLAY_SETTING_VSYNC:
          vsync.value = message.vsync?.enabled ?? false
          return
        case DisplaySettingRequestType.DISPLAY_SETTING_FRAME_RATE_LIMIT:
          limitFps.value = message.frameLimit?.flag ?? false
          maxFps.value = message.frameLimit?.limit ?? null
          return
        case DisplaySettingRequestType.DISPLAY_SETTING_HDR:
          hdrEnabled.value = message.hdr?.enabled ?? false
          hdrOutputDevice.value = message.hdr?.outputDevice ?? null
          hdrColorGamut.value = message.hdr?.colorGamut ?? null
          setDisplayHdrUnsupportedBadgeVisible(!(message.hdr?.supported ?? false))
          return
        case DisplaySettingRequestType.DISPLAY_SETTING_ACCESSIBILITY:
          brightness.value = message.slidersAccessibility?.brightness ?? null
          gamma.value = message.slidersAccessibility?.gamma ?? null
          contrast.value = message.slidersAccessibility?.contrast ?? null
          return
        case DisplaySettingRequestType.DISPLAY_SETTING_CAMERA:
          fov.value = message.slidersCamera?.fov ?? null
          cameraSmoothing.value = message.slidersCamera?.smoothing ?? null
          screenShakeIntensity.value = message.slidersCamera?.shake ?? null
          headBobbingIntensity.value = message.slidersCamera?.bob ?? null
          return
        default:
          return
      }
    }

    function requestDisplaySettings(): void {
      const client = getScpWebSocketClient()

      if (!client || client.connectionState !== 'open') {
        return
      }

      pendingDisplayRequestTypes.value = new Set(displayRequestTypes)

      for (const requestType of displayRequestTypes) {
        client.sendTypedMessage(
          MessageType.REQUEST_GET_DISPLAY_SETTINGS,
          { requestType },
          RequestGetDisplaySettings,
        )
      }
    }

    onMounted(() => {
      const client = getScpWebSocketClient()

      if (!client) {
        return
      }

      unsubscribeResponse = client.onTypedMessage(
        MessageType.RESPONSE_DISPLAY_SETTINGS,
        (message) => {
          applyDisplayResponse(message)
        },
      )

      unsubscribeState = client.onStateChange((state) => {
        if (state === 'open') {
          requestDisplaySettings()
        }
      })

      if (client.connectionState === 'open') {
        requestDisplaySettings()
      }
    })

    onUnmounted(() => {
      unsubscribeResponse?.()
      unsubscribeState?.()
    })

    const displayHelp = {
      fullscreenMode:
        'Fullscreen mode changes how the game presents on your display. Windowed Fullscreen is usually the safest option for alt-tab and multi-monitor play.',
      resolution:
        'Example picks: 1920 x 1080 for a standard 16:9 monitor, 2560 x 1440 for sharper image quality, or 3840 x 2160 for 4K.',
      sync:
        'VSync helps prevent tearing, but can add a little input latency. Turn it off if you want the snappiest response.',
      frameRateLimit:
        'Use this to cap performance and keep the frame pacing steady. Example caps: 60 for stability, 120 for high refresh, or 144 for a fast monitor.',
      hdrOutputDevice:
        'Matches the engine HDR output path. Leave it on the default unless you know your monitor expects a specific output mode.',
      hdrColorGamut:
        'Select the color space your display handles best. Most players can leave this on the default recommended gamut.',
      hdrEnabled:
        'HDR shifts the output path into high dynamic range when your display supports it.',
      brightness:
        'Raises or lowers overall screen luminance. Increase it if dark areas feel crushed; lower it if the scene looks washed out.',
      gamma:
        'Adjusts mid-tone visibility. If shadows hide too much detail, raise gamma a little.',
      contrast:
        'Controls the separation between dark and bright areas. Higher contrast makes the image punchier, but can hide detail.',
      fov:
        'Changes how much of the scene is visible at once. Higher values show more of the world; lower values feel tighter and more focused.',
      cameraSmoothing:
        'Softens camera motion and can reduce harsh movement. Lower values feel more direct; higher values feel more floaty.',
      screenShakeIntensity:
        'Controls how much the camera reacts to explosions, impacts, and heavy events. Lower it if shake is distracting.',
      headBobbingIntensity:
        'Controls how strongly the camera bobs while moving. Lower it for a steadier view during long play sessions.',
    } as const

    return {
      brightness,
      cameraSmoothing,
      contrast,
      displaySettingsLoaded,
      displaySettingsRuntime,
      displayHelp,
      applyBrightness: () => applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_BRIGHTNESS, brightness.value),
      applyCameraSmoothing: () =>
        applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_CAMERA_SMOOTHING, cameraSmoothing.value),
      applyContrast: () => applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_CONTRAST, contrast.value),
      applyFov: () => applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_FOV, fov.value),
      applyFrameRateLimit,
      applyFrameRateLimitToggle,
      applyFrameRateLimitValue,
      applyFullscreenMode,
      applyGamma: () => applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_GAMMA, gamma.value),
      applyHdrColorGamut,
      applyHdrEnabled,
      applyHdrOutputDevice,
      applyHeadBobbingIntensity: () =>
        applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_HEAD_BOBBING_INTENSITY, headBobbingIntensity.value),
      applyResolution,
      applyScreenShakeIntensity: () =>
        applyDisplaySlider(DisplaySliderType.DISPLAY_SLIDER_SCREEN_SHAKE_INTENSITY, screenShakeIntensity.value),
      applyVsync,
      fpsControlsDisabled,
      fov,
      fullscreenMode,
      fullscreenModes,
      gamma,
      hdrColorGamut,
      hdrColorGamutOptions,
      hdrToggleDisabled,
      hdrControlsDisabled,
      hdrEnabled,
      hdrOutputDevice,
      hdrOutputDeviceOptions,
      headBobbingIntensity,
      limitFps,
      maxFps,
      hoverHelpDelay,
      resolution,
      resolutionDisabled,
      resolutionOptions,
      screenShakeIntensity,
      vsync,
    }
  },
})
