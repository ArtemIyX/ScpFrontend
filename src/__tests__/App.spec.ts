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

    expect(wrapper.text()).toContain('Component showcases')
    expect(wrapper.text()).toContain('GText')
    expect(wrapper.text()).toContain('GButton')
    expect(wrapper.text()).toContain('GInput')
    expect(wrapper.text()).toContain('GCombo')
    expect(wrapper.find('.gscroller').exists()).toBe(true)
    expect(wrapper.text()).toContain('Disabled launch')
    expect(wrapper.text()).toContain('Warning preset')
    expect(wrapper.text()).toContain('Purple preset')
    expect(wrapper.text()).toContain('Background anomaly')
    expect(wrapper.text()).toContain('Nickname')
    expect(wrapper.text()).toContain('Search logs')
    expect(wrapper.text()).toContain('Region')
    expect(wrapper.text()).toContain('Role')
    expect(wrapper.find('button[disabled]').exists()).toBe(true)
    expect(wrapper.text()).toContain('message UiEvent')
    expect(wrapper.find('.gscroller').exists()).toBe(true)
    expect(wrapper.find('.gbutton').exists()).toBe(true)
    expect(wrapper.find('.ginput').exists()).toBe(true)
    expect(wrapper.find('.gcombo').exists()).toBe(true)
  })
})
