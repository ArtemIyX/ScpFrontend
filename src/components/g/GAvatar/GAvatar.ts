export type GAvatarPreset = 'surface' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
export type GAvatarSize = 'sm' | 'md' | 'lg'
export type GAvatarShape = 'circle' | 'square'
export type GAvatarStatus = 'online' | 'away' | 'busy' | 'offline' | 'none'

export interface GAvatarProps {
  name?: string
  src?: string
  alt?: string
  initials?: string
  size?: GAvatarSize | string
  preset?: GAvatarPreset
  shape?: GAvatarShape
  status?: GAvatarStatus
  statusLabel?: string
  decorative?: boolean
  ariaLabel?: string
  title?: string
}

export function buildGAvatarClasses(props: {
  preset: GAvatarPreset
  shape: GAvatarShape
  size: GAvatarSize | string
  hasSrc: boolean
  hasInitials: boolean
  status: GAvatarStatus
}) {
  return [
    'gavatar',
    `gavatar--${props.preset}`,
    `gavatar--${props.shape}`,
    props.size === 'sm' || props.size === 'md' || props.size === 'lg' ? `gavatar--${props.size}` : '',
    props.hasSrc ? 'gavatar--src' : '',
    props.hasInitials ? 'gavatar--initials' : '',
    props.status !== 'none' ? `gavatar--status-${props.status}` : '',
  ].filter(Boolean)
}

export function deriveAvatarInitials(name: string | undefined, fallback: string | undefined): string {
  const source = (fallback || name || '').trim()
  if (!source) {
    return '?'
  }

  const parts = source
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    const [onlyPart = ''] = parts
    return onlyPart.slice(0, 2).toUpperCase()
  }

  const [firstPart = '', secondPart = ''] = parts
  const first = firstPart.charAt(0)
  const second = secondPart.charAt(0)
  return `${first}${second}`.toUpperCase()
}

export function avatarStatusLabel(status: GAvatarStatus): string {
  switch (status) {
    case 'online':
      return 'Online'
    case 'away':
      return 'Away'
    case 'busy':
      return 'Busy'
    case 'offline':
      return 'Offline'
    default:
      return ''
  }
}
