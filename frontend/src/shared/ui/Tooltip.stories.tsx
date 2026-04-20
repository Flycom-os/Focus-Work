import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from './Button'

const meta: Meta<typeof Tooltip> = { title: 'UI/Tooltip', component: Tooltip }
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'Helpful text',
    children: <Button variant="ghost">Hover me</Button>,
  },
}

