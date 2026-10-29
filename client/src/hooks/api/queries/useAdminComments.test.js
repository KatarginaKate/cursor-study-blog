import { renderHook, waitFor } from '@testing-library/react'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useAdminComments } from './useAdminComments'

describe('useAdminComments', () => {
  it('loads comments from the admin endpoint', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: { success: true, comments: [{ _id: 'c1', content: 'Hello' }] }
    })
    const { result } = renderHook(() => useAdminComments(), { wrapper: hookWrapper })

    await waitFor(() => expect(result.current.comments).toEqual([{ _id: 'c1', content: 'Hello' }]))
    expect(axios.get).toHaveBeenCalledWith('/api/admin/comments')
  })
})
