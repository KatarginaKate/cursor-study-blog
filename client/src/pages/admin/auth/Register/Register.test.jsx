import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { renderWithProviders } from '@/test/render'
import Register from './Register'

describe('Register', () => {
  it('requires an email and password', async () => {
    renderWithProviders(<Register />)

    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Please enter your email')).toBeInTheDocument()
    expect(screen.getByText('Please enter your password')).toBeInTheDocument()
  })

  it('tells the user registration is not available yet', async () => {
    renderWithProviders(<Register />)

    await userEvent.type(screen.getByLabelText('Email'), 'ada@studysprint.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret1')
    await userEvent.type(screen.getByLabelText('Repeat password'), 'secret1')
    await userEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(toast.info).toHaveBeenCalledWith('Registration feature coming soon!')
  })
})
