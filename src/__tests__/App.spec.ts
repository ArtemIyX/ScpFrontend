import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { customComponentsPlugin } from '../components/register'
import GameUiView from '../views/GameUiView.vue'

describe('App', () => {
  it('renders the routed game ui view', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/game-ui', component: GameUiView }],
    })

    await router.push('/game-ui')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, customComponentsPlugin],
      },
    })

    expect(wrapper.text()).toContain('Custom component debug')
    expect(wrapper.text()).toContain('message UiEvent')
    expect(wrapper.find('.font-grid').exists()).toBe(true)
  })
})
