import { screen, within } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { commentApi } from '@/api'
import { renderWithProviders } from '@/test/render'
import Comments from './Comments'

const { adminComments } = vi.hoisted(() => ({
  adminComments: {
    current: { comments: [], loading: false, refetch: vi.fn() }
  }
}))

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useAdminComments: () => adminComments.current
  }
})

const comments = [{
  _id: 'c1',
  content: 'Needs review',
  name: 'Ada',
  isApproved: false,
  createdAt: '2024-02-02',
  blog: { title: 'Roadmap' }
}]

const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })

describe('Comments', () => {
  it('shows a spinner while comments load', () => {
    adminComments.current = { comments: [], loading: true, refetch: vi.fn() }
    const { container } = renderWithProviders(<Comments />)
    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('shows the comment and approves it', async () => {
    adminComments.current = { comments, loading: false, refetch: vi.fn() }
    vi.spyOn(commentApi, 'approve').mockResolvedValue({ data: { success: true } })
    vi.spyOn(commentApi, 'delete').mockResolvedValue({ data: { success: true } })
    renderWithProviders(<Comments />)

    expect(screen.getByText('Needs review')).toBeInTheDocument()
    const row = screen.getByRole('row', { name: /Needs review/ })
    const buttons = within(row).getAllByRole('button')

    await user.click(buttons[0])
    expect(commentApi.approve).toHaveBeenCalledWith('c1')

    await user.click(buttons[1])
    expect(commentApi.delete).toHaveBeenCalledWith('c1')
  })
})
