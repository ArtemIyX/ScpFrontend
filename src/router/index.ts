import { createRouter, createWebHistory } from 'vue-router'

import GameUiView from '@/views/GameUiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/game-ui' },
    { path: '/game-ui', name: 'game-ui', component: GameUiView },
  ],
})

export default router
