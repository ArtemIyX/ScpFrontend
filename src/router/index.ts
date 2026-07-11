import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import MainMenuView from '@/views/MainMenuView'

const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:'
const history = isFileProtocol
  ? createWebHashHistory()
  : createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes: [
    { path: '/', redirect: '/main-menu' },
    { path: '/main-menu', name: 'main-menu', component: MainMenuView },
    { path: '/game-ui', redirect: '/main-menu' },
  ],
})

export default router
