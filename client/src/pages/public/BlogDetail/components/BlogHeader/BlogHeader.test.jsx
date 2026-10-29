import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import BlogHeader from './BlogHeader'

const blog = {
  title: 'Roadmap',
  category: 'Learning Strategies',
  subTitle: 'A short guide'
}

describe('BlogHeader', () => {
  it('shows the title and the default author', () => {
    renderWithProviders(<BlogHeader blog={blog} />)

    expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
    expect(screen.getByText('Michael Brown')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows the cover when the article has an image', () => {
    renderWithProviders(<BlogHeader blog={{ ...blog, image: '/cover.png' }} />)
    expect(screen.getByRole('img', { name: 'Roadmap' })).toBeInTheDocument()
  })
})
