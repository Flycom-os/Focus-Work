import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { TagInput } from './TagInput'

function Wrapper() {
  const [tags, setTags] = useState<string[]>([])
  return <TagInput value={tags} onChange={setTags} />
}

describe('TagInput', () => {
  it('adds tag on Enter', async () => {
    render(<Wrapper />)
    const input = screen.getByPlaceholderText('Add tag and press Enter')
    await userEvent.type(input, 'hello{enter}')
    expect(screen.getByText(/hello/i)).toBeInTheDocument()
  })
})

