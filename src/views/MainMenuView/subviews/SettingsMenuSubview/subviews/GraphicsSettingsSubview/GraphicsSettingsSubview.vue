<script lang="ts" src="./GraphicsSettingsSubview.ts"></script>

<template>
  <section class="graphics-settings" aria-label="Graphics settings">
    <section class="graphics-settings__group" aria-label="Scalability settings">
      <div class="graphics-settings__stack">
        <GField
          label="Resolution Scale"
          helper="Controls internal rendering scale before final output."
          width="full"
          class="graphics-settings__feature-field"
        >
          <GSlider
            v-model="resolutionScale"
            :min="50"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Resolution scale"
          />
        </GField>

        <div class="graphics-settings__quality-grid">
          <GField
            label="View Distance Quality"
            helper="Affects how far geometry and scene detail remain fully resolved."
            width="full"
            class="graphics-settings__feature-field"
          >
            <GRail
              v-model="viewDistanceQuality"
              :items="scalabilityItems"
              width="full"
              preset="quiet"
              aria-label="View distance quality"
            />
          </GField>

          <GField
            label="Anti-Aliasing Quality"
            helper="Controls edge smoothing quality and related resolve cost."
            width="full"
            class="graphics-settings__feature-field"
          >
            <GRail
              v-model="antiAliasingQuality"
              :items="scalabilityItems"
              width="full"
              preset="quiet"
              aria-label="Anti-aliasing quality"
            />
          </GField>
        </div>


      </div>
    </section>



    <section class="graphics-settings__group" aria-label="Post process settings">


      <GField
        label="Post Process Quality"
        helper="Changing any detailed override flips this profile to Custom."
        width="full"
        class="graphics-settings__feature-field"
      >
        <template #head>
          <GButton
            size="sm"
            shape="chip"
            icon-only
            :preset="postProcessCustomOpen ? 'accent' : 'ghost'"
            :pressed="postProcessCustomOpen"
            :aria-label="postProcessCustomOpen ? 'Hide post process customization' : 'Open post process customization'"
            :title="postProcessCustomOpen ? 'Hide customization' : 'Open customization'"
            class="graphics-settings__feature-action"
            @click="togglePostProcessCustomOpen"
          >
            <template #icon>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 4.25h10M5.25 8h5.5M7 11.75h2"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.4"
                />
              </svg>
            </template>
          </GButton>
        </template>

        <div class="graphics-settings__postprocess-stack">
          <GRail
            :model-value="postProcessPreset"
            :items="postProcessPresetItems"
            width="full"
            preset="quiet"
            aria-label="Post process quality"
            @update:model-value="onPostProcessPresetChange"
          />

          <div v-if="postProcessCustomOpen" class="graphics-settings__custom-panel">

            <div class="graphics-settings__custom-grid">
              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Motion Blur Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.MotionBlurQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/3/3/4</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.motionBlurQuality"
                  :min="0"
                  :max="4"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Motion blur quality"
                  @update:model-value="updatePostProcessSetting('motionBlurQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Blur GBuffer</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.BlurGBuffer</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/-1/-1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.blurGBuffer"
                  :min="-1"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Blur GBuffer"
                  @update:model-value="updatePostProcessSetting('blurGBuffer', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Ambient Occlusion Levels</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.AmbientOcclusionLevels</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/1/2/3</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.ambientOcclusionLevels"
                  :min="0"
                  :max="3"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Ambient occlusion levels"
                  @update:model-value="updatePostProcessSetting('ambientOcclusionLevels', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">AO Radius Scale</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.AmbientOcclusionRadiusScale</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">1.7/1.7/1.5/1.0</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.ambientOcclusionRadiusScale"
                  mode="float"
                  :min="0.5"
                  :max="2"
                  :step="0.1"
                  :precision="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Ambient occlusion radius scale"
                  @update:model-value="updatePostProcessSetting('ambientOcclusionRadiusScale', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Depth Of Field Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.DepthOfFieldQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/1/2/2</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.depthOfFieldQuality"
                  :min="0"
                  :max="2"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Depth of field quality"
                  @update:model-value="updatePostProcessSetting('depthOfFieldQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Render Target Pool Min</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.RenderTargetPoolMin</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">300/350/400/400</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.renderTargetPoolMin"
                  :min="300"
                  :max="500"
                  :step="10"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Render target pool minimum"
                  @update:model-value="updatePostProcessSetting('renderTargetPoolMin', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Lens Flare Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.LensFlareQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/2/2</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.lensFlareQuality"
                  :min="0"
                  :max="2"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Lens flare quality"
                  @update:model-value="updatePostProcessSetting('lensFlareQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Scene Color Fringe Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.SceneColorFringeQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/1/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.sceneColorFringeQuality"
                  :min="0"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Scene color fringe quality"
                  @update:model-value="updatePostProcessSetting('sceneColorFringeQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Eye Adaptation Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.EyeAdaptationQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/2/2</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.eyeAdaptationQuality"
                  :min="0"
                  :max="2"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Eye adaptation quality"
                  @update:model-value="updatePostProcessSetting('eyeAdaptationQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Bloom Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.BloomQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">4/4/5/5</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.bloomQuality"
                  :min="4"
                  :max="5"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Bloom quality"
                  @update:model-value="updatePostProcessSetting('bloomQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Fast Blur Threshold</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.FastBlurThreshold</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/2/3/7</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.fastBlurThreshold"
                  :min="0"
                  :max="7"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Fast blur threshold"
                  @update:model-value="updatePostProcessSetting('fastBlurThreshold', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Upscale Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Upscale.Quality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">1/2/2/3</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.upscaleQuality"
                  :min="1"
                  :max="3"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Upscale quality"
                  @update:model-value="updatePostProcessSetting('upscaleQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Grain Quantization</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Tonemapper.GrainQuantization</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/1/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="postProcessSettings.tonemapperGrainQuantization"
                  :min="0"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Tonemapper grain quantization"
                  @update:model-value="updatePostProcessSetting('tonemapperGrainQuantization', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </GField>
    </section>


    <section class="graphics-settings__group" aria-label="Shadow settings">
      <GField
        label="Shadow Quality"
        helper="Changing any detailed override flips this profile to Custom."
        width="full"
        class="graphics-settings__feature-field"
      >
        <template #head>
          <GButton
            size="sm"
            shape="chip"
            icon-only
            :preset="shadowCustomOpen ? 'accent' : 'ghost'"
            :pressed="shadowCustomOpen"
            :aria-label="shadowCustomOpen ? 'Hide shadow customization' : 'Open shadow customization'"
            :title="shadowCustomOpen ? 'Hide customization' : 'Open customization'"
            class="graphics-settings__feature-action"
            @click="toggleShadowCustomOpen"
          >
            <template #icon>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 4.25h10M5.25 8h5.5M7 11.75h2"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.4"
                />
              </svg>
            </template>
          </GButton>
        </template>

        <div class="graphics-settings__postprocess-stack">
          <GRail
            :model-value="shadowPreset"
            :items="shadowPresetItems"
            width="full"
            preset="quiet"
            aria-label="Shadow quality"
            @update:model-value="onShadowPresetChange"
          />

          <div v-if="shadowCustomOpen" class="graphics-settings__custom-panel">
            <GText as="p" preset="muted" class="graphics-settings__custom-summary">
              Manual overrides map directly to the underlying UE shadow console variables.
            </GText>

            <div class="graphics-settings__custom-grid">
              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Light Function Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.LightFunctionQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/1/1/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.lightFunctionQuality"
                  :min="0"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Light function quality"
                  @update:model-value="updateShadowSetting('lightFunctionQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Shadow Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.ShadowQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/2/5/5</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.shadowQuality"
                  :min="0"
                  :max="5"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Shadow quality override"
                  @update:model-value="updateShadowSetting('shadowQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">CSM Max Cascades</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Shadow.CSM.MaxCascades</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">1/1/2/4</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.shadowCsmMaxCascades"
                  :min="1"
                  :max="4"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Shadow CSM max cascades"
                  @update:model-value="updateShadowSetting('shadowCsmMaxCascades', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Max Resolution</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Shadow.MaxResolution</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">512/1024/1024/1024</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.shadowMaxResolution"
                  :min="512"
                  :max="2048"
                  :step="128"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Shadow max resolution"
                  @update:model-value="updateShadowSetting('shadowMaxResolution', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Radius Threshold</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Shadow.RadiusThreshold</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0.06/0.05/0.04/0.03</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.shadowRadiusThreshold"
                  mode="float"
                  :min="0.01"
                  :max="0.1"
                  :step="0.01"
                  :precision="2"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Shadow radius threshold"
                  @update:model-value="updateShadowSetting('shadowRadiusThreshold', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Distance Scale</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Shadow.DistanceScale</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0.6/0.7/0.85/1.0</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.shadowDistanceScale"
                  mode="float"
                  :min="0.5"
                  :max="1.5"
                  :step="0.05"
                  :precision="2"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Shadow distance scale"
                  @update:model-value="updateShadowSetting('shadowDistanceScale', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">CSM Transition Scale</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Shadow.CSM.TransitionScale</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0.25/0.8/1.0</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="shadowSettings.shadowCsmTransitionScale"
                  mode="float"
                  :min="0"
                  :max="1.5"
                  :step="0.05"
                  :precision="2"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Shadow CSM transition scale"
                  @update:model-value="updateShadowSetting('shadowCsmTransitionScale', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </GField>
    </section>

    <section class="graphics-settings__group" aria-label="Texture settings">
      <GField
        label="Texture Quality"
        helper="Controls mip bias, anisotropy, and streaming pool budget."
        width="full"
        class="graphics-settings__feature-field"
      >
        <template #head>
          <GButton
            size="sm"
            shape="chip"
            icon-only
            :preset="textureCustomOpen ? 'accent' : 'ghost'"
            :pressed="textureCustomOpen"
            :aria-label="textureCustomOpen ? 'Hide texture customization' : 'Open texture customization'"
            :title="textureCustomOpen ? 'Hide customization' : 'Open customization'"
            class="graphics-settings__feature-action"
            @click="toggleTextureCustomOpen"
          >
            <template #icon>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 4.25h10M5.25 8h5.5M7 11.75h2"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.4"
                />
              </svg>
            </template>
          </GButton>
        </template>

        <div class="graphics-settings__postprocess-stack">
          <GRail
            :model-value="texturePreset"
            :items="texturePresetItems"
            width="full"
            preset="quiet"
            aria-label="Texture quality"
            @update:model-value="onTexturePresetChange"
          />

          <div v-if="textureCustomOpen" class="graphics-settings__custom-panel">
            <div class="graphics-settings__custom-grid">
              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Mip Bias</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Streaming.MipBias</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">2.5/1/0/0</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="textureSettings.streamingMipBias"
                  mode="float"
                  :min="0"
                  :max="3"
                  :step="0.1"
                  :precision="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Texture streaming mip bias"
                  @update:model-value="updateTextureSetting('streamingMipBias', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Max Anisotropy</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.MaxAnisotropy</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/2/4/8</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="textureSettings.maxAnisotropy"
                  :min="0"
                  :max="16"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Texture max anisotropy"
                  @update:model-value="updateTextureSetting('maxAnisotropy', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Streaming Pool Size</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.Streaming.PoolSize</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">200/400/700/1000</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="textureSettings.streamingPoolSize"
                  :min="200"
                  :max="2000"
                  :step="50"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Texture streaming pool size"
                  @update:model-value="updateTextureSetting('streamingPoolSize', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </GField>
    </section>

    <section class="graphics-settings__group" aria-label="Effects settings">
      <GField
        label="Effects Quality"
        helper="Controls translucency volume detail, refraction, scene color format, and detail response."
        width="full"
        class="graphics-settings__feature-field"
      >
        <template #head>
          <GButton
            size="sm"
            shape="chip"
            icon-only
            :preset="effectsCustomOpen ? 'accent' : 'ghost'"
            :pressed="effectsCustomOpen"
            :aria-label="effectsCustomOpen ? 'Hide effects customization' : 'Open effects customization'"
            :title="effectsCustomOpen ? 'Hide customization' : 'Open customization'"
            class="graphics-settings__feature-action"
            @click="toggleEffectsCustomOpen"
          >
            <template #icon>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 4.25h10M5.25 8h5.5M7 11.75h2"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.4"
                />
              </svg>
            </template>
          </GButton>
        </template>

        <div class="graphics-settings__postprocess-stack">
          <GRail
            :model-value="effectsPreset"
            :items="effectsPresetItems"
            width="full"
            preset="quiet"
            aria-label="Effects quality"
            @update:model-value="onEffectsPresetChange"
          />

          <div v-if="effectsCustomOpen" class="graphics-settings__custom-panel">
            <div class="graphics-settings__custom-grid">
              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Translucency Volume Dim</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.TranslucencyLightingVolumeDim</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">24/32/48/64</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.translucencyLightingVolumeDim"
                  :min="16"
                  :max="96"
                  :step="8"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Translucency lighting volume dimension"
                  @update:model-value="updateEffectsSetting('translucencyLightingVolumeDim', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Refraction Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.RefractionQuality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/2/2</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.refractionQuality"
                  :min="0"
                  :max="2"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Refraction quality"
                  @update:model-value="updateEffectsSetting('refractionQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Screen Space Reflections</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.SSR</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/0/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.ssr"
                  :min="0"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Screen space reflections enable"
                  @update:model-value="updateEffectsSetting('ssr', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">SSR Quality</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.SSR.Quality</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/0/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.ssrQuality"
                  :min="0"
                  :max="4"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Screen space reflections quality"
                  @update:model-value="updateEffectsSetting('ssrQuality', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Scene Color Format</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.SceneColorFormat</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">3/3/3/4</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.sceneColorFormat"
                  :min="3"
                  :max="5"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Scene color format"
                  @update:model-value="updateEffectsSetting('sceneColorFormat', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Detail Mode</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.DetailMode</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/1/1/2</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.detailMode"
                  :min="0"
                  :max="2"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Detail mode"
                  @update:model-value="updateEffectsSetting('detailMode', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Translucency Blur</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.TranslucencyVolumeBlur</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/0/1/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.translucencyVolumeBlur"
                  :min="0"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Translucency volume blur"
                  @update:model-value="updateEffectsSetting('translucencyVolumeBlur', $event)"
                />
              </div>

              <div class="graphics-settings__custom-row">
                <div class="graphics-settings__custom-copy">
                  <GText as="span" class="graphics-settings__custom-label">Material Quality Level</GText>
                  <div class="graphics-settings__custom-meta-row">
                    <GText as="span" preset="muted" class="graphics-settings__custom-meta">r.MaterialQualityLevel</GText>
                    <GText as="span" preset="muted" class="graphics-settings__custom-preset-values">0/1/1/1</GText>
                  </div>
                </div>
                <GNumberInput
                  class="graphics-settings__custom-input"
                  :model-value="effectsSettings.effectsMaterialQualityLevel"
                  :min="0"
                  :max="1"
                  :step="1"
                  :step-buttons="false"
                  :show-value="false"
                  width="full"
                  preset="quiet"
                  aria-label="Effects material quality level"
                  @update:model-value="updateEffectsSetting('effectsMaterialQualityLevel', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </GField>
    </section>
  </section>
</template>

<style scoped>
.graphics-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.graphics-settings__group {
  display: grid;
  gap: 1rem;
}

.graphics-settings__stack {
  display: grid;
  gap: 1rem;
}

.graphics-settings__quality-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.graphics-settings__divider {
  margin-top: 0.35rem;
}

.graphics-settings__postprocess-stack {
  display: grid;
  gap: 0.9rem;
}

.graphics-settings__feature-field {
  position: relative;
}

.graphics-settings__feature-field :deep(.gfield__head) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.22rem;
  padding-bottom: 0.45rem;
}

.graphics-settings__feature-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1.08rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.graphics-settings__feature-field :deep(.gfield__helper) {
  max-width: 44rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(216, 225, 214, 0.74);
}

.graphics-settings__feature-action {
  margin-top: -0.05rem;
}

.graphics-settings__feature-action :deep(svg) {
  width: 0.95rem;
  height: 0.95rem;
}

.graphics-settings__custom-panel {
  display: grid;
  gap: 0.7rem;
  padding: 0.9rem 1rem 1rem;
  border: 1px solid rgba(198, 255, 74, 0.1);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.03), transparent 16%),
    linear-gradient(180deg, rgba(11, 15, 14, 0.74), rgba(7, 9, 9, 0.88));
}

.graphics-settings__custom-summary {
  margin: 0;
}

.graphics-settings__custom-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem 1rem;
}

.graphics-settings__custom-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 6.5rem;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.35rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.graphics-settings__custom-copy {
  display: grid;
  gap: 0.12rem;
  min-width: 0;
}

.graphics-settings__custom-meta-row {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  min-width: 0;
}

.graphics-settings__custom-label {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(233, 238, 224, 0.9);
}

.graphics-settings__custom-meta {
  font-size: 0.67rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.graphics-settings__custom-preset-values {
  flex: 0 0 auto;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  opacity: 0.72;
}

.graphics-settings__custom-input {
  min-width: 0;
}

@media (max-width: 64rem) {
  .graphics-settings__quality-grid,
  .graphics-settings__custom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
