import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'

const meta: Meta<typeof TextField> = {
  title: 'UI/TextField',
  component: TextField,
  args: { label: 'Email', placeholder: 'name@example.com' },
}

export default meta
type Story = StoryObj<typeof TextField>

export const Default: Story = {}
export const WithHint: Story = { args: { hint: 'We will never share your email.' } }

