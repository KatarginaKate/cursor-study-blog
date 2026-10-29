import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import BlogDetail from './BlogDetail'

const { blogState, commentState } = vi.hoisted(() => ({
  blogState: { current: { blog: null, loading: true } },
  commentState: { current: { comments: [], addComment: vi.fn() } }
}))

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useBlog: () => blogState.current,
    useComments: () => commentState.current
  }
})

describe('BlogDetail', () => {
  it('shows the loader while the article is loading', () => {
    blogState.current = { blog: null, loading: true }
    const { container } = renderWithProviders(<BlogDetail />, {
      route: '/blog/1',
      path: '/blog/:id'
    })

    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('shows the comment form and list after the article loads', async () => {
    blogState.current = {
      loading: false,
      blog: {
        _id: '1',
        title: 'Roadmap',
        description: '<p>Body</p>',
        category: 'Learning Strategies'
      }
    }
    commentState.current = { comments: [], addComment: vi.fn() }

    renderWithProviders(<BlogDetail />, {
      route: '/blog/1',
      path: '/blog/:id'
    })

    expect(await screen.findByRole('heading', { name: 'Roadmap' })).toBeInTheDocument()
    expect(screen.getByText('No comments yet. Be the first!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
  })
})
