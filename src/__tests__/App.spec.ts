import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the font debug shell', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('Font debug')
    expect(wrapper.text()).toContain('font-title')
    expect(wrapper.text()).toContain('font-handwrite')
    expect(wrapper.text()).toContain('font-technical')
    expect(wrapper.find('.font-grid').exists()).toBe(true)
  })
})
