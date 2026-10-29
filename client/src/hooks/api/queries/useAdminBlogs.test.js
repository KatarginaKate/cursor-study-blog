import { renderHook, waitFor } from '@testing-library/react'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useAdminBlogs } from './useAdminBlogs'

describe('useAdminBlogs', () => {
  it('loads blogs from the admin endpoint', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1', title: 'Draft' }] }
    })
    const { result } = renderHook(() => useAdminBlogs(), { wrapper: hookWrapper })

    await waitFor(() => expect(result.current.blogs).toEqual([{ _id: '1', title: 'Draft' }]))
    expect(axios.get).toHaveBeenCalledWith('/api/admin/blogs')
  })
})
