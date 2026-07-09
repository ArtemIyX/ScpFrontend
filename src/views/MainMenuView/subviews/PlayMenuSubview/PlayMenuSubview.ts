import { defineComponent } from 'vue'

const missionCards = [
  {
    title: 'Quick Deploy',
    meta: '1-3 players',
    description: 'Fast queue into a short containment round with minimal staging time.',
  },
  {
    title: 'Squad Operation',
    meta: '4-8 players',
    description: 'Full tactical lobby with operator roles, briefing sync, and coordinated spawn.',
  },
  {
    title: 'Private Drill',
    meta: 'Invite only',
    description: 'Controlled session for testing routes, settings, and team coordination.',
  },
] as const

const queueStats = [
  { label: 'Region', value: 'EU West' },
  { label: 'Ping', value: '42 ms' },
  { label: 'Squad', value: '3 / 5' },
]

export default defineComponent({
  name: 'PlayMenuSubview',
  setup() {
    return {
      missionCards,
      queueStats,
    }
  },
})
