import { useLocation } from 'react-router-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import Header from './Header'

function Path() {
  const location = useLocation()
  return <span>{location.pathname}</span>
}

describe('Header', () => {
  it('sends a guest to register', async () => {
    renderWithProviders(
      <>
        <Header />
        <Path />
      </>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Start writing' }))
    expect(screen.getByText('/register')).toBeInTheDocument()
  })

  it('sends a signed-in user to the article form', async () => {
    localStorage.setItem('token', 'secret')
    renderWithProviders(
      <>
        <Header />
        <Path />
      </>
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Start writing' }))
    expect(await screen.findByText('/admin/addBlog')).toBeInTheDocument()
  })
})
