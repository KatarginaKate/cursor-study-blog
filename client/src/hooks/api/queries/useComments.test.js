import { act, renderHook, waitFor } from '@testing-library/react'
import { commentApi } from '@/api'
import { useComments } from './useComments'

describe('useComments', () => {
  it('loads approved comments for the blog', async () => {
    vi.spyOn(commentApi, 'getByBlogId').mockResolvedValue({
      data: { success: true, comments: [{ _id: 'c1', content: 'Nice' }] }
    })
    const { result } = renderHook(() => useComments('blog-1'))

    await waitFor(() => expect(result.current.comments).toEqual([{ _id: 'c1', content: 'Nice' }]))
    expect(commentApi.getByBlogId).toHaveBeenCalledWith('blog-1')
  })

  it('returns success and reloads after a comment is added', async () => {
    vi.spyOn(commentApi, 'getByBlogId').mockResolvedValue({
      data: { success: true, comments: [] }
    })
    vi.spyOn(commentApi, 'add').mockResolvedValue({
      data: { success: true, message: 'Saved' }
    })
    const { result } = renderHook(() => useComments('blog-1'))
    await waitFor(() => expect(commentApi.getByBlogId).toHaveBeenCalledTimes(1))

    let response
    await act(async () => {
      response = await result.current.addComment({ blog: 'blog-1', name: 'Ada', content: 'Hello' })
    })

    expect(response).toEqual({ success: true })
    expect(commentApi.add).toHaveBeenCalledWith({ blog: 'blog-1', name: 'Ada', content: 'Hello' })
    expect(commentApi.getByBlogId).toHaveBeenCalledTimes(2)
  })

  it('returns failure when adding a comment fails', async () => {
    vi.spyOn(commentApi, 'getByBlogId').mockResolvedValue({
      data: { success: true, comments: [] }
    })
    vi.spyOn(commentApi, 'add').mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useComments('blog-1'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response
    await act(async () => {
      response = await result.current.addComment({ content: 'Hello' })
    })

    expect(response.success).toBe(false)
    expect(response.message).toBe('offline')
  })
})
