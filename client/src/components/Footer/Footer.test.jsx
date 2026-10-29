import { useLocation } from 'react-router-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import Footer from './Footer'

function Path() {
  const location = useLocation()
  return <span>{location.pathname}</span>
}

describe('Footer', () => {
  it('opens home, login, and register from the quick links', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <Footer />
        <Path />
      </>,
      { route: '/blog/1', path: '*' }
    )

    await user.click(screen.getByText('All Articles'))
    expect(screen.getByText('/')).toBeInTheDocument()

    window.history.pushState({}, '', '/blog/1')
    await user.click(screen.getByText('Login'))
    expect(screen.getByText('/admin')).toBeInTheDocument()

    await user.click(screen.getByText('Register'))
    expect(screen.getByText('/register')).toBeInTheDocument()
  })
})
