import type { ReactNode } from 'react'
import { useState } from 'react'

type Props = {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <span className="uiTip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open ? <span className="uiTip__bubble" role="tooltip">{content}</span> : null}
    </span>
  )
}

