import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
}

export function TextField({ label, hint, className, ...props }: Props) {
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      {label ? <div className="field__label">{label}</div> : null}
      <input className="input" {...props} />
      {hint ? <div className="muted">{hint}</div> : null}
    </label>
  )
}

