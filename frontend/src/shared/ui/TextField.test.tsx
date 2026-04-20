import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextField } from './TextField'

describe('TextField', () => {
  it('allows typing', async () => {
    render(<TextField label="Name" />)
    const input = screen.getByLabelText('Name')
    await userEvent.type(input, 'Alex')
    expect(input).toHaveValue('Alex')
  })
})

