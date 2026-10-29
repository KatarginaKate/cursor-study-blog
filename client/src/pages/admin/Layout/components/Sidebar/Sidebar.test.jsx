import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('links to the admin sections', () => {
    renderWithProviders(<Sidebar />, { route: '/admin' })

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Add Article' })).toHaveAttribute('href', '/admin/addBlog')
    expect(screen.getByRole('link', { name: 'All Articles' })).toHaveAttribute('href', '/admin/articles')
    expect(screen.getByRole('link', { name: 'Comments' })).toHaveAttribute('href', '/admin/comments')
  })
})
