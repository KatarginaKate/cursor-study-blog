import { screen, within } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { blogApi } from '@/api'
import { renderWithProviders } from '@/test/render'
import Articles from './Articles'

const { adminBlogs } = vi.hoisted(() => ({
  adminBlogs: {
    current: { blogs: [], loading: false, refetch: vi.fn() }
  }
}))

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useAdminBlogs: () => adminBlogs.current
  }
})

const blogs = [
  { _id: 'b', title: 'Banana', createdAt: '2024-02-02', isPublished: true },
  { _id: 'a', title: 'Apple', createdAt: '2024-01-01', isPublished: false }
]

const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })

describe('Articles', () => {
  it('shows a spinner while articles load', () => {
    adminBlogs.current = { blogs: [], loading: true, refetch: vi.fn() }
    const { container } = renderWithProviders(<Articles />)
    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('lists titles and sorts them A to Z', async () => {
    adminBlogs.current = { blogs, loading: false, refetch: vi.fn() }
    renderWithProviders(<Articles />)

    const cells = () => screen.getAllByRole('cell').map((cell) => cell.textContent)
    expect(cells().indexOf('Banana')).toBeLessThan(cells().indexOf('Apple'))

    const sortGroup = screen.getByRole('radiogroup')
    await user.click(within(sortGroup).getByText('A-Z'))
    expect(cells().indexOf('Apple')).toBeLessThan(cells().indexOf('Banana'))
  })

  it('publishes a draft and deletes an article', async () => {
    adminBlogs.current = { blogs, loading: false, refetch: vi.fn() }
    vi.spyOn(blogApi, 'publish').mockResolvedValue({ data: { success: true } })
    vi.spyOn(blogApi, 'deleteBlog').mockResolvedValue({ data: { success: true } })
    renderWithProviders(<Articles />)

    const draftRow = screen.getByRole('row', { name: /Apple/ })
    const buttons = within(draftRow).getAllByRole('button')
    await user.click(buttons[0])
    expect(blogApi.publish).toHaveBeenCalledWith('a')

    await user.click(buttons[1])
    expect(blogApi.deleteBlog).toHaveBeenCalledWith('a')
  })
})
