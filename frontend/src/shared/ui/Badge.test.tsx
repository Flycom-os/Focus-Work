import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>Normal</Badge>)
    expect(screen.getByText('Normal')).toBeInTheDocument()
  })
})

