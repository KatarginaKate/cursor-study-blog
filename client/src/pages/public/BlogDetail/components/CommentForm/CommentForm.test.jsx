import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import CommentForm from './CommentForm'

function tokenFor(name) {
  const payload = btoa(JSON.stringify({ name }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `header.${payload}.sig`
}

describe('CommentForm', () => {
  it('asks a guest to log in or register', async () => {
    renderWithProviders(<CommentForm onSubmit={vi.fn()} />)

    expect(screen.getByText('Want to share your thoughts or leave a comment?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('requires a comment before submit', async () => {
    localStorage.setItem('token', tokenFor('Ada'))
    const onSubmit = vi.fn()
    renderWithProviders(<CommentForm onSubmit={onSubmit} />)

    await userEvent.click(await screen.findByRole('button', { name: 'Submit' }))

    expect(await screen.findByText('Please enter your comment')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the signed-in name and clears the field', async () => {
    localStorage.setItem('token', tokenFor('Ada'))
    const onSubmit = vi.fn().mockResolvedValue({ success: true })
    renderWithProviders(<CommentForm onSubmit={onSubmit} />)

    const field = await screen.findByPlaceholderText('Your comment')
    await userEvent.type(field, 'Hello there')
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', content: 'Hello there' })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your comment')).toHaveValue('')
    })
  })
})
