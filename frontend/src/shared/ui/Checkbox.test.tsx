import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('toggles', async () => {
    render(<Checkbox label="Accept" />)
    const cb = screen.getByLabelText('Accept')
    expect(cb).not.toBeChecked()
    await userEvent.click(cb)
    expect(cb).toBeChecked()
  })
})

