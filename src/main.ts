import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { customComponentsPlugin } from './components/register'
import router from './router'
import { installScpWebSocketWindowApi, SCP_UI_LOADED_MESSAGE } from './services'
import './styles/global.css'
import './styles/fonts.css'
import './styles/colors.css'

document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})

installScpWebSocketWindowApi()

const app = createApp(App)

app.use(createPinia())
app.use(customComponentsPlugin)
app.use(router)

app.mount('#app')

console.info(SCP_UI_LOADED_MESSAGE)
