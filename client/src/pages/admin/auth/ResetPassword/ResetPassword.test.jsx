import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { renderWithProviders } from '@/test/render'
import ResetPassword from './ResetPassword'

describe('ResetPassword', () => {
  it('requires an email', async () => {
    renderWithProviders(<ResetPassword />)

    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }))
    expect(await screen.findByText('Please enter your email')).toBeInTheDocument()
  })

  it('confirms the reset link was sent', async () => {
    renderWithProviders(<ResetPassword />)

    await userEvent.type(screen.getByLabelText('Email'), 'ada@studysprint.com')
    await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    expect(toast.success).toHaveBeenCalledWith('If the email exists, a reset link has been sent!')
  })
})
