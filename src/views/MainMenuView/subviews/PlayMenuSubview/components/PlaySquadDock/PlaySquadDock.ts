import { defineComponent } from 'vue'

const squadSlots = [
  {
    id: 'self',
    label: 'You',
    name: 'Operative 17',
    filled: true,
  },
  {
    id: 'friend-1',
    label: 'Friend Slot',
    name: 'Empty',
    filled: false,
  },
  {
    id: 'friend-2',
    label: 'Friend Slot',
    name: 'Empty',
    filled: false,
  },
  {
    id: 'friend-3',
    label: 'Friend Slot',
    name: 'Empty',
    filled: false,
  },
] as const

export default defineComponent({
  name: 'PlaySquadDock',
  setup() {
    return {
      squadSlots,
    }
  },
})
