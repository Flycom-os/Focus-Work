import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders initials', () => {
    render(<Avatar name="Alex Johnson" />)
    expect(screen.getByText('AJ')).toBeInTheDocument()
  })
})

