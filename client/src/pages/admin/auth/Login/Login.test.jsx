import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { adminApi } from '@/api'
import { renderWithProviders } from '@/test/render'
import Login from './Login'

describe('Login', () => {
  it('requires an email and password', async () => {
    renderWithProviders(<Login />)

    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(await screen.findByText('Please enter your email')).toBeInTheDocument()
    expect(screen.getByText('Please enter your password')).toBeInTheDocument()
  })

  it('stores the token only when login succeeds', async () => {
    vi.spyOn(adminApi, 'login').mockResolvedValue({
      data: { success: true, token: 'tok' }
    })
    renderWithProviders(<Login />)

    await userEvent.type(screen.getByLabelText('Email'), 'ada@studysprint.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => expect(localStorage.getItem('token')).toBe('tok'))
    expect(adminApi.login).toHaveBeenCalledWith({
      email: 'ada@studysprint.com',
      password: 'secret'
    })
  })

  it('does not store a token when login fails', async () => {
    vi.spyOn(adminApi, 'login').mockResolvedValue({
      data: { success: false, message: 'Invalid Credentials' }
    })
    renderWithProviders(<Login />)

    await userEvent.type(screen.getByLabelText('Email'), 'ada@studysprint.com')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid Credentials'))
    expect(localStorage.getItem('token')).toBeNull()
  })
})
