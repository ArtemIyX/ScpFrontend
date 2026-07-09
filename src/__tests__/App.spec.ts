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
    expect(wrapper.text()).toContain('GSlider')
    expect(wrapper.text()).toContain('GNumberInput')
    expect(wrapper.text()).toContain('GCheckbox')
    expect(wrapper.text()).toContain('GSwitch')
    expect(wrapper.text()).toContain('GRadio')
    expect(wrapper.text()).toContain('GCombo')
    expect(wrapper.text()).toContain('GTabs')
    expect(wrapper.text()).toContain('GPanel')
    expect(wrapper.text()).toContain('GBadge')
    expect(wrapper.text()).toContain('GToast')
    expect(wrapper.text()).toContain('GWindow')
    expect(wrapper.text()).toContain('GModal')
    expect(wrapper.text()).toContain('Standard modal')
    expect(wrapper.find('.gscroller').exists()).toBe(true)
    expect(wrapper.text()).toContain('Disabled launch')
    expect(wrapper.text()).toContain('Warning preset')
    expect(wrapper.text()).toContain('Purple preset')
    expect(wrapper.text()).toContain('Background anomaly')
    expect(wrapper.text()).toContain('Nickname')
    expect(wrapper.text()).toContain('Search logs')
    expect(wrapper.text()).toContain('Region')
    expect(wrapper.text()).toContain('Role')
    expect(wrapper.text()).toContain('Menu')
    expect(wrapper.text()).toContain('Lobby')
    expect(wrapper.text()).toContain('Containment Briefing')
    expect(wrapper.text()).toContain('Ready')
    expect(wrapper.text()).toContain('Settings Window')
    expect(wrapper.text()).toContain('Modal')
    expect(wrapper.find('button[disabled]').exists()).toBe(true)
    expect(wrapper.text()).toContain('message UiEvent')
    expect(wrapper.find('.gscroller').exists()).toBe(true)
    expect(wrapper.find('.gbutton').exists()).toBe(true)
    expect(wrapper.find('.ginput').exists()).toBe(true)
    expect(wrapper.find('.gslider').exists()).toBe(true)
    expect(wrapper.find('.gnumberinput').exists()).toBe(true)
    expect(wrapper.find('.gcheckbox').exists()).toBe(true)
    expect(wrapper.find('.gswitch').exists()).toBe(true)
    expect(wrapper.find('.gradio').exists()).toBe(true)
    expect(wrapper.find('.gcombo').exists()).toBe(true)
    expect(wrapper.find('.gtabs').exists()).toBe(true)
    expect(wrapper.find('.gpanel').exists()).toBe(true)
    expect(wrapper.find('.gbadge').exists()).toBe(true)
    expect(wrapper.find('.gtoast').exists()).toBe(true)
    expect(wrapper.find('.gwindow').exists()).toBe(true)
    expect(wrapper.text()).toContain('Connection stable')

    const openButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Standard modal'))

    expect(openButton).toBeTruthy()
    await openButton!.trigger('click')

    expect(wrapper.find('.gmodal').exists()).toBe(true)
    expect(wrapper.text()).toContain('Standard Modal')
  })
})
