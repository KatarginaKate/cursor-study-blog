import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render'
import Dashboard from './Dashboard'

const { dashboard } = vi.hoisted(() => ({
  dashboard: {
    current: {
      loading: false,
      refetch: vi.fn(),
      dashboardData: { blogs: 6, drafts: 2, comments: 4, recentBlogs: [], recentComments: [] }
    }
  }
}))

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useAdminDashboard: () => dashboard.current
  }
})

describe('Dashboard', () => {
  it('shows the article and draft counts', () => {
    renderWithProviders(<Dashboard />)

    expect(screen.getByText('Articles').parentElement).toHaveTextContent('6')
    expect(screen.getByText('Drafts').parentElement).toHaveTextContent('2')
  })
})
