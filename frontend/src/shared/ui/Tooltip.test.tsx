import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'
import { Button } from './Button'

describe('Tooltip', () => {
  it('shows on hover', async () => {
    render(
      <Tooltip content="Tip">
        <Button>Hover</Button>
      </Tooltip>,
    )
    await userEvent.hover(screen.getByRole('button', { name: 'Hover' }))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tip')
  })
})

