type Props = {
  children: string
  tone?: 'neutral' | 'success' | 'warning'
}

export function Badge({ children, tone = 'neutral' }: Props) {
  const cls = tone === 'success' ? 'uiBadge uiBadge--success' : tone === 'warning' ? 'uiBadge uiBadge--warning' : 'uiBadge'
  return <span className={cls}>{children}</span>
}

