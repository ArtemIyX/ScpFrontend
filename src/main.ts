import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { customComponentsPlugin } from './components/register'
import router from './router'
import './styles/global.css'
import './styles/fonts.css'
import './styles/colors.css'

document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})

const app = createApp(App)

app.use(createPinia())
app.use(customComponentsPlugin)
app.use(router)

app.mount('#app')
