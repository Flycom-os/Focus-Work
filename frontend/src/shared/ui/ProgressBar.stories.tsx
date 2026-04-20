import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = { title: 'UI/ProgressBar', component: ProgressBar, args: { value: 42 } }
export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {}
export const Full: Story = { args: { value: 100 } }

