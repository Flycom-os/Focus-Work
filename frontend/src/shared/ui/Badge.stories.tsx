import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = { title: 'UI/Badge', component: Badge }
export default meta
type Story = StoryObj<typeof Badge>

export const Neutral: Story = { args: { children: 'Normal', tone: 'neutral' } }
export const Success: Story = { args: { children: 'Success', tone: 'success' } }
export const Warning: Story = { args: { children: 'Warning', tone: 'warning' } }

