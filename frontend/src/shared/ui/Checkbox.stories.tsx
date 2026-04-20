import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

function Demo() {
  const [checked, setChecked] = useState(false)
  return <Checkbox label={checked ? 'Enabled' : 'Disabled'} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
}

const meta: Meta<typeof Demo> = {
  title: 'UI/Checkbox',
  component: Demo,
}

export default meta
type Story = StoryObj<typeof Demo>

export const Default: Story = {}

