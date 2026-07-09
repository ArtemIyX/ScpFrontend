import type { App } from 'vue'

import GButton from './g/GButton/GButton.vue'
import GBadge from './g/GBadge/GBadge.vue'
import GLabel from './g/GLabel/GLabel.vue'
import GField from './g/GField/GField.vue'
import GSection from './g/GSection/GSection.vue'
import GDivider from './g/GDivider/GDivider.vue'
import GTooltip from './g/GTooltip/GTooltip.vue'
import GAccordion from './g/GAccordion/GAccordion.vue'
import GPopover from './g/GPopover/GPopover.vue'
import GAvatar from './g/GAvatar/GAvatar.vue'
import GIcon from './g/GIcon/GIcon.vue'
import GKeybindInput from './g/GKeybindInput/GKeybindInput.vue'
import GTile from './g/GTile/GTile.vue'
import GRail from './g/GRail/GRail.vue'
import GCombo from './g/GCombo/GCombo.vue'
import GLoading from './g/GLoading/GLoading.vue'
import GEmptyState from './g/GEmptyState/GEmptyState.vue'
import GSkeleton from './g/GSkeleton/GSkeleton.vue'
import GList from './g/GList/GList.vue'
import GListItem from './g/GListItem/GListItem.vue'
import GMenuList from './g/GMenuList/GMenuList.vue'
import GCheckbox from './g/GCheckbox/GCheckbox.vue'
import GNumberInput from './g/GNumberInput/GNumberInput.vue'
import GProgress from './g/GProgress/GProgress.vue'
import GTextarea from './g/GTextarea/GTextarea.vue'
import GSwitch from './g/GSwitch/GSwitch.vue'
import GRadio from './g/GRadio/GRadio.vue'
import GInput from './g/GInput/GInput.vue'
import GSlider from './g/GSlider/GSlider.vue'
import GToast from './g/GToast/GToast.vue'
import GAlert from './g/GAlert/GAlert.vue'
import GBanner from './g/GBanner/GBanner.vue'
import GCard from './g/GCard/GCard.vue'
import GPanel from './g/GPanel/GPanel.vue'
import GTabs from './g/GTabs/GTabs.vue'
import GModal from './g/GModal/GModal.vue'
import GWindow from './g/GWindow/GWindow.vue'
import GScroller from './g/GScroller/GScroller.vue'
import GText from './g/GText/GText.vue'

export function registerCustomComponents(app: App): void {
  app.component('GText', GText)
  app.component('gtext', GText)
  app.component('GButton', GButton)
  app.component('gbutton', GButton)
  app.component('GBadge', GBadge)
  app.component('gbadge', GBadge)
  app.component('GLabel', GLabel)
  app.component('glabel', GLabel)
  app.component('GField', GField)
  app.component('gfield', GField)
  app.component('GSection', GSection)
  app.component('gsection', GSection)
  app.component('GDivider', GDivider)
  app.component('gdivider', GDivider)
  app.component('GTooltip', GTooltip)
  app.component('gtooltip', GTooltip)
  app.component('GAccordion', GAccordion)
  app.component('gaccordion', GAccordion)
  app.component('GPopover', GPopover)
  app.component('gpopover', GPopover)
  app.component('GAvatar', GAvatar)
  app.component('gavatar', GAvatar)
  app.component('GIcon', GIcon)
  app.component('gicon', GIcon)
  app.component('GKeybindInput', GKeybindInput)
  app.component('gkeybindinput', GKeybindInput)
  app.component('GTile', GTile)
  app.component('gtile', GTile)
  app.component('GRail', GRail)
  app.component('grail', GRail)
  app.component('GCombo', GCombo)
  app.component('gcombo', GCombo)
  app.component('GLoading', GLoading)
  app.component('gloading', GLoading)
  app.component('GEmptyState', GEmptyState)
  app.component('gemptystate', GEmptyState)
  app.component('GSkeleton', GSkeleton)
  app.component('gskeleton', GSkeleton)
  app.component('GList', GList)
  app.component('glist', GList)
  app.component('GListItem', GListItem)
  app.component('glistitem', GListItem)
  app.component('GMenuList', GMenuList)
  app.component('gmenulist', GMenuList)
  app.component('GCheckbox', GCheckbox)
  app.component('gcheckbox', GCheckbox)
  app.component('GNumberInput', GNumberInput)
  app.component('gnumberinput', GNumberInput)
  app.component('GProgress', GProgress)
  app.component('gprogress', GProgress)
  app.component('GTextarea', GTextarea)
  app.component('gtextarea', GTextarea)
  app.component('GSwitch', GSwitch)
  app.component('gswitch', GSwitch)
  app.component('GRadio', GRadio)
  app.component('gradio', GRadio)
  app.component('GInput', GInput)
  app.component('ginput', GInput)
  app.component('GSlider', GSlider)
  app.component('gslider', GSlider)
  app.component('GToast', GToast)
  app.component('gtoast', GToast)
  app.component('GAlert', GAlert)
  app.component('galert', GAlert)
  app.component('GBanner', GBanner)
  app.component('gbanner', GBanner)
  app.component('GCard', GCard)
  app.component('gcard', GCard)
  app.component('GPanel', GPanel)
  app.component('gpanel', GPanel)
  app.component('GTabs', GTabs)
  app.component('gtabs', GTabs)
  app.component('GModal', GModal)
  app.component('gmodal', GModal)
  app.component('GWindow', GWindow)
  app.component('gwindow', GWindow)
  app.component('GScroller', GScroller)
  app.component('gscroller', GScroller)
}

export const customComponentsPlugin = {
  install(app: App): void {
    registerCustomComponents(app)
  },
}
