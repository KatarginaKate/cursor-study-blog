import { act, renderHook } from '@testing-library/react'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useBlogActions } from './useBlogActions'

describe('useBlogActions', () => {
  it('does not delete when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const post = vi.spyOn(axios, 'post')
    const { result } = renderHook(() => useBlogActions(), { wrapper: hookWrapper })

    await act(async () => {
      await result.current.deleteBlog('1')
    })

    expect(post).not.toHaveBeenCalled()
  })

  it('publishes the blog id', async () => {
    const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { success: true, message: 'Published' } })
    const { result } = renderHook(() => useBlogActions(), { wrapper: hookWrapper })

    let response
    await act(async () => {
      response = await result.current.publishBlog('1')
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledWith('/api/blog/publish', { id: '1' })
  })
})
