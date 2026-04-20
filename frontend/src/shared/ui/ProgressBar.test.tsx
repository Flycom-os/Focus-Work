import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders bar', () => {
    render(<ProgressBar value={50} label="Progress" />)
    expect(screen.getByLabelText('Progress')).toBeInTheDocument()
  })
})

