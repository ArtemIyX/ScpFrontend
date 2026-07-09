import { createRouter, createWebHistory } from 'vue-router'

import MainMenuView from '@/views/MainMenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/main-menu' },
    { path: '/main-menu', name: 'main-menu', component: MainMenuView },
    { path: '/game-ui', redirect: '/main-menu' },
  ],
})

export default router
