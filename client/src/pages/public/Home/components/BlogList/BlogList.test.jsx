import { useLocation } from 'react-router-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { blogApi } from '@/api'
import { renderWithProviders } from '@/test/render'
import BlogList from './BlogList'

function Path() {
  const location = useLocation()
  return <span>{location.pathname}</span>
}

const blog = {
  _id: '42',
  title: 'Roadmap',
  description: '<p>Start here</p>',
  image: '/cover.png',
  category: 'Learning Strategies'
}

describe('BlogList', () => {
  it('shows the empty state when there are no articles', async () => {
    renderWithProviders(<BlogList />)
    expect(await screen.findByText('No blogs found')).toBeInTheDocument()
  })

  it('opens the selected article', async () => {
    vi.spyOn(blogApi, 'getAll').mockResolvedValue({
      data: { success: true, blogs: [blog] }
    })
    renderWithProviders(
      <>
        <BlogList />
        <Path />
      </>
    )

    await userEvent.click(await screen.findByRole('button', { name: /Roadmap/ }))
    expect(screen.getByText('/blog/42')).toBeInTheDocument()
  })
})
