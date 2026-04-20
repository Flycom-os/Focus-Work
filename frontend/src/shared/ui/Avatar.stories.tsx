import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = { title: 'UI/Avatar', component: Avatar, args: { name: 'Alex Johnson' } }
export default meta
type Story = StoryObj<typeof Avatar>

export const Initials: Story = {}
export const WithImage: Story = {
  args: {
    src: 'https://picsum.photos/80',
    size: 44,
  },
}

