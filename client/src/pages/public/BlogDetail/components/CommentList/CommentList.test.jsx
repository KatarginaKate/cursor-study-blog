import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import CommentList from './CommentList'

describe('CommentList', () => {
  it('shows the empty message', () => {
    renderWithProviders(<CommentList comments={[]} />)
    expect(screen.getByText('No comments yet. Be the first!')).toBeInTheDocument()
  })

  it('shows the author and the comment', () => {
    renderWithProviders(
      <CommentList comments={[{
        _id: 'c1',
        name: 'Ada',
        content: 'This helped',
        createdAt: '2024-01-15T00:00:00.000Z'
      }]} />
    )

    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('This helped')).toBeInTheDocument()
  })
})
