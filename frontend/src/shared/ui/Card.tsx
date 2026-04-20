import type { ReactNode } from 'react'

type Props = {
  title?: string
  hint?: string
  children: ReactNode
}

export function Card({ title, hint, children }: Props) {
  return (
    <div className="card">
      {title || hint ? (
        <div className="card__header">
          {title ? <div className="card__title">{title}</div> : null}
          {hint ? <div className="card__hint">{hint}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

