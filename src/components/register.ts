import type { App } from 'vue'

import GText from './g/GText/GText.vue'

export function registerCustomComponents(app: App): void {
  app.component('GText', GText)
}

export const customComponentsPlugin = {
  install(app: App): void {
    registerCustomComponents(app)
  },
}
