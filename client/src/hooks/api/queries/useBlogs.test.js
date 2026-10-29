import { renderHook, waitFor } from '@testing-library/react'
import { blogApi } from '@/api'
import { useBlogs } from './useBlogs'

describe('useBlogs', () => {
  it('exposes the blog list from the API', async () => {
    vi.spyOn(blogApi, 'getAll').mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1', title: 'Roadmap' }] }
    })
    const { result } = renderHook(() => useBlogs())

    await waitFor(() => expect(result.current.blogs).toEqual([{ _id: '1', title: 'Roadmap' }]))
    expect(blogApi.getAll).toHaveBeenCalled()
  })
})
