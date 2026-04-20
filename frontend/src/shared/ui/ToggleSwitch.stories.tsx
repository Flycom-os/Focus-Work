import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ToggleSwitch } from './ToggleSwitch'

function Demo() {
  const [on, setOn] = useState(false)
  return <ToggleSwitch checked={on} onChange={setOn} label={on ? 'On' : 'Off'} />
}

const meta: Meta<typeof Demo> = { title: 'UI/ToggleSwitch', component: Demo }
export default meta
type Story = StoryObj<typeof Demo>

export const Default: Story = {}

