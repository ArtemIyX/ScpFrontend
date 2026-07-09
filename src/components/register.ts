import type { App } from 'vue'

import GButton from './g/GButton/GButton.vue'
import GCombo from './g/GCombo/GCombo.vue'
import GInput from './g/GInput/GInput.vue'
import GTabs from './g/GTabs/GTabs.vue'
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
  app.component('GTabs', GTabs)
  app.component('gtabs', GTabs)
  app.component('GScroller', GScroller)
  app.component('gscroller', GScroller)
}

export const customComponentsPlugin = {
  install(app: App): void {
    registerCustomComponents(app)
  },
}
