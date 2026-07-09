import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './styles/global.css'
import './styles/colors.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
