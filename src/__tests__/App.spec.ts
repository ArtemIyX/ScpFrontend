import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { customComponentsPlugin } from '../components/register'
import MainMenuView from '../views/MainMenuView.vue'

describe('App', () => {
  it('renders the routed main menu view', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/main-menu', component: MainMenuView }],
    })

    await router.push('/main-menu')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, customComponentsPlugin],
      },
    })

    expect(wrapper.text()).toContain('Deploy Into The Facility')
    expect(wrapper.text()).toContain('Play')
    expect(wrapper.find('.main-menu').exists()).toBe(true)
    expect(wrapper.find('.main-menu__window').exists()).toBe(true)
  })
})
