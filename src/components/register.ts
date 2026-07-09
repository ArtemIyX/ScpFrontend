import type { App } from 'vue'

import GButton from './g/GButton/GButton.vue'
import GBadge from './g/GBadge/GBadge.vue'
import GCombo from './g/GCombo/GCombo.vue'
import GCheckbox from './g/GCheckbox/GCheckbox.vue'
import GRadio from './g/GRadio/GRadio.vue'
import GInput from './g/GInput/GInput.vue'
import GSlider from './g/GSlider/GSlider.vue'
import GToast from './g/GToast/GToast.vue'
import GPanel from './g/GPanel/GPanel.vue'
import GTabs from './g/GTabs/GTabs.vue'
import GModal from './g/GModal/GModal.vue'
import GWindow from './g/GWindow/GWindow.vue'
import GScroller from './g/GScroller/GScroller.vue'
import GText from './g/GText/GText.vue'

export function registerCustomComponents(app: App): void {
  app.component('GText', GText)
  app.component('gtext', GText)
  app.component('GButton', GButton)
  app.component('gbutton', GButton)
  app.component('GBadge', GBadge)
  app.component('gbadge', GBadge)
  app.component('GCombo', GCombo)
  app.component('gcombo', GCombo)
  app.component('GCheckbox', GCheckbox)
  app.component('gcheckbox', GCheckbox)
  app.component('GRadio', GRadio)
  app.component('gradio', GRadio)
  app.component('GInput', GInput)
  app.component('ginput', GInput)
  app.component('GSlider', GSlider)
  app.component('gslider', GSlider)
  app.component('GToast', GToast)
  app.component('gtoast', GToast)
  app.component('GPanel', GPanel)
  app.component('gpanel', GPanel)
  app.component('GTabs', GTabs)
  app.component('gtabs', GTabs)
  app.component('GModal', GModal)
  app.component('gmodal', GModal)
  app.component('GWindow', GWindow)
  app.component('gwindow', GWindow)
  app.component('GScroller', GScroller)
  app.component('gscroller', GScroller)
}

export const customComponentsPlugin = {
  install(app: App): void {
    registerCustomComponents(app)
  },
}
