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

    return {
      brightness,
      cameraSmoothing,
      contrast,
      displaySettingsRuntime,
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
      resolution,
      resolutionDisabled,
      resolutionOptions,
      screenShakeIntensity,
      vsync,
    }
  },
})
