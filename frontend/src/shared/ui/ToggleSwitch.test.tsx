import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleSwitch } from './ToggleSwitch'

describe('ToggleSwitch', () => {
  it('calls onChange', async () => {
    const changes: boolean[] = []
    render(<ToggleSwitch checked={false} onChange={(v) => changes.push(v)} label="Toggle" />)
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(changes).toEqual([true])
  })
})

