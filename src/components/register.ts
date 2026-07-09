import type { App } from 'vue'

import GButton from './g/GButton/GButton.vue'
import GCombo from './g/GCombo/GCombo.vue'
import GInput from './g/GInput/GInput.vue'
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
  app.component('GCombo', GCombo)
  app.component('gcombo', GCombo)
  app.component('GInput', GInput)
  app.component('ginput', GInput)
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
