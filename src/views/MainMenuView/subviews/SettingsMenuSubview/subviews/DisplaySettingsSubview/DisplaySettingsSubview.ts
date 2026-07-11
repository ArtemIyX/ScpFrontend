import { computed, defineComponent, reactive, ref } from 'vue'

import type { GComboOption } from '@/components/g/GCombo/GCombo'

type FullscreenMode = 'fullscreen' | 'borderless' | 'windowed'

const fullscreenModes: Array<{ value: FullscreenMode; label: string }> = [
  { value: 'fullscreen', label: 'Fullscreen' },
  { value: 'borderless', label: 'Windowed Fullscreen' },
  { value: 'windowed', label: 'Windowed' },
]

const resolutionOptions: GComboOption[] = [
  { value: '1280x720', label: '1280 x 720' },
  { value: '1600x900', label: '1600 x 900' },
  { value: '1920x1080', label: '1920 x 1080' },
  { value: '2560x1440', label: '2560 x 1440' },
  { value: '3440x1440', label: '3440 x 1440' },
  { value: '3840x2160', label: '3840 x 2160' },
]

const hdrOutputDeviceOptions: GComboOption[] = [
  { value: 0, label: 'sRGB (LDR)' },
  { value: 1, label: 'Rec709 (LDR)' },
  { value: 2, label: 'Explicit Gamma Mapping (LDR)' },
  { value: 3, label: 'ACES 1000-nit ST-2084 (Dolby PQ)' },
  { value: 4, label: 'ACES 2000-nit ST-2084 (Dolby PQ)' },
  { value: 5, label: 'ACES 1000-nit ScRGB' },
  { value: 6, label: 'ACES 2000-nit ScRGB' },
]

const hdrColorGamutOptions: GComboOption[] = [
  { value: 0, label: 'Rec709 / sRGB, D65' },
  { value: 1, label: 'DCI-P3, D65' },
  { value: 2, label: 'Rec2020 / BT2020, D65' },
  { value: 3, label: 'ACES, D60' },
  { value: 4, label: 'ACEScg, D60' },
]

export const displaySettingsRuntime = reactive({
  showHdrUnsupportedBadge: true,
})

export function setDisplayHdrUnsupportedBadgeVisible(visible: boolean): void {
  displaySettingsRuntime.showHdrUnsupportedBadge = visible
}

export default defineComponent({
  name: 'DisplaySettingsSubview',
  setup() {
    const fullscreenMode = ref<FullscreenMode>('fullscreen')
    const resolution = ref<string | number | null>('2560x1440')
    const vsync = ref(true)
    const limitFps = ref(true)
    const maxFps = ref<number | null>(144)
    const hdrEnabled = ref(false)
    const hdrOutputDevice = ref<number | null>(3)
    const hdrColorGamut = ref<number | null>(1)

    const brightness = ref<number | null>(50)
    const gamma = ref<number | null>(50)
    const contrast = ref<number | null>(50)

    const fov = ref<number | null>(100)
    const cameraSmoothing = ref<number | null>(40)
    const screenShakeIntensity = ref<number | null>(65)
    const headBobbingIntensity = ref<number | null>(35)

    const resolutionDisabled = computed(() => fullscreenMode.value === 'borderless')
    const fpsControlsDisabled = computed(() => !limitFps.value)
    const hdrControlsDisabled = computed(() => !hdrEnabled.value)
    const hoverHelpDelay = 600

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
      displaySettingsRuntime,
      displayHelp,
      fpsControlsDisabled,
      fov,
      fullscreenMode,
      fullscreenModes,
      gamma,
      hdrColorGamut,
      hdrColorGamutOptions,
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
