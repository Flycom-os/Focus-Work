import type { ReactNode } from 'react'
import { Button } from './Button'

type Props = {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null
  return (
    <div className="uiModal__backdrop" role="dialog" aria-modal="true" aria-label={title ?? 'Dialog'}>
      <div className="uiModal">
        <div className="uiModal__top">
          <div className="uiModal__title">{title ?? 'Dialog'}</div>
          <Button variant="ghost" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>
        <div className="uiModal__body">{children}</div>
      </div>
    </div>
  )
}

