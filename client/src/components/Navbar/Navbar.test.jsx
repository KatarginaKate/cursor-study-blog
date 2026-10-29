import { useLocation } from 'react-router-dom'
import { renderWithProviders } from '@/test/render'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

function Path() {
  const location = useLocation()
  return <span>{location.pathname}</span>
}

describe('Navbar', () => {
  it('shows login and register when logged out', () => {
    renderWithProviders(
      <>
        <Navbar />
        <Path />
      </>
    )

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument()
  })

  it('shows the dashboard when a token is stored', async () => {
    localStorage.setItem('token', 'secret')
    renderWithProviders(<Navbar />)

    expect(await screen.findByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
  })

  it('scrolls to recent articles on the home page', async () => {
    window.history.pushState({}, '', '/')
    const target = document.createElement('div')
    target.id = 'recent-articles'
    target.scrollIntoView = vi.fn()
    document.body.appendChild(target)

    renderWithProviders(
      <>
        <Navbar />
        <Path />
      </>,
      { route: '/' }
    )
    await userEvent.click(screen.getByRole('button', { name: 'Articles' }))

    expect(target.scrollIntoView).toHaveBeenCalled()
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('navigates home when articles is clicked from another page', async () => {
    window.history.pushState({}, '', '/blog/1')
    renderWithProviders(
      <>
        <Navbar />
        <Path />
      </>,
      { route: '/blog/1' }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Articles' }))
    expect(screen.getByText('/')).toBeInTheDocument()
  })
})
