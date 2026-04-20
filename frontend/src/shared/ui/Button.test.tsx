import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders and clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Hello</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Hello' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

