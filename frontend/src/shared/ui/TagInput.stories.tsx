import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TagInput } from './TagInput'

function Demo() {
  const [tags, setTags] = useState<string[]>(['react', 'vite'])
  return <TagInput value={tags} onChange={setTags} />
}

const meta: Meta<typeof Demo> = { title: 'UI/TagInput', component: Demo }
export default meta
type Story = StoryObj<typeof Demo>

export const Default: Story = {}

