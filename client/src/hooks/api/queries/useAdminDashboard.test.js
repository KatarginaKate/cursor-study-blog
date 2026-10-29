import { renderHook, waitFor } from '@testing-library/react'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useAdminDashboard } from './useAdminDashboard'

describe('useAdminDashboard', () => {
  it('exposes dashboard counts from the admin endpoint', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: { success: true, dashboardData: { blogs: 4, drafts: 1, comments: 2, recentBlogs: [], recentComments: [] } }
    })
    const { result } = renderHook(() => useAdminDashboard(), { wrapper: hookWrapper })

    await waitFor(() => expect(result.current.dashboardData.blogs).toBe(4))
    expect(result.current.dashboardData.drafts).toBe(1)
    expect(axios.get).toHaveBeenCalledWith('/api/admin/dashboard')
  })
})
