import type { InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

export function Checkbox({ label, className, ...props }: Props) {
  return (
    <label className={['uiCheck', className].filter(Boolean).join(' ')}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}

