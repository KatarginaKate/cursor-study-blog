import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import SocialShare from './SocialShare'

describe('SocialShare', () => {
  it('shows the share label', () => {
    renderWithProviders(<SocialShare />)
    expect(screen.getByText('Share this article on social media')).toBeInTheDocument()
  })
})
