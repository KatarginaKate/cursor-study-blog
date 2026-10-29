import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { blogApi } from '@/api'
import { useBlog } from './useBlog'

describe('useBlog', () => {
  it('loads the blog for the given id', async () => {
    vi.spyOn(blogApi, 'getById').mockResolvedValue({
      data: { success: true, blog: { _id: '1', title: 'Roadmap' } }
    })
    const { result } = renderHook(() => useBlog('1'))

    await waitFor(() => expect(result.current.blog).toEqual({ _id: '1', title: 'Roadmap' }))
    expect(blogApi.getById).toHaveBeenCalledWith('1')
  })

  it('toasts when the request fails', async () => {
    vi.spyOn(blogApi, 'getById').mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useBlog('1'))

    await waitFor(() => expect(result.current.error).toBe('offline'))
    expect(toast.error).toHaveBeenCalledWith('offline')
  })
})
