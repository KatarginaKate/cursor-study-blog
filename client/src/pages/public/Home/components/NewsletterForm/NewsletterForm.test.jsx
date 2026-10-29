import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { renderWithProviders } from '@/test/render'
import NewsletterForm from './NewsletterForm'

describe('NewsletterForm', () => {
  it('does not subscribe an invalid email', async () => {
    renderWithProviders(<NewsletterForm />)

    await userEvent.type(screen.getByPlaceholderText('Enter your email id'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address')
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('subscribes a valid email', async () => {
    renderWithProviders(<NewsletterForm />)

    await userEvent.type(screen.getByPlaceholderText('Enter your email id'), 'ada@studysprint.com')
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Successfully subscribed to newsletter!')
    })
  })
})
