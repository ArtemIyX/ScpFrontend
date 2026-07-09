import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the debug palette shell', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Debug palette')
    expect(wrapper.text()).toContain('ui-accent-lime-300')
    expect(wrapper.find('.debug-grid').exists()).toBe(true)
  })
})
