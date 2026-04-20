import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'

function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid">
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} title="Edit" onClose={() => setOpen(false)}>
        <div className="muted">Modal content</div>
      </Modal>
    </div>
  )
}

const meta: Meta<typeof Demo> = { title: 'UI/Modal', component: Demo }
export default meta
type Story = StoryObj<typeof Demo>

export const Default: Story = {}

