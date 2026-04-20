type Props = {
  value: number
  max?: number
  label?: string
}

export function ProgressBar({ value, max = 100, label }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="uiProgress" aria-label={label ?? 'Progress'}>
      <div className="uiProgress__bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

