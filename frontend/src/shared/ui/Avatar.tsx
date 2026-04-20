type Props = {
  name: string
  src?: string | null
  size?: number
}

export function Avatar({ name, src, size = 32 }: Props) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  return (
    <div className="uiAvatar" style={{ width: size, height: size }} aria-label={name} title={name}>
      {src ? <img className="uiAvatar__img" src={src} alt={name} /> : <span className="uiAvatar__txt">{initials || '?'}</span>}
    </div>
  )
}

