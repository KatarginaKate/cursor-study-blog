import { act, renderHook } from '@testing-library/react'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useCreateBlog } from './useCreateBlog'

describe('useCreateBlog', () => {
  it('rejects a missing image without posting', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const post = vi.spyOn(axios, 'post')
    const { result } = renderHook(() => useCreateBlog(), { wrapper: hookWrapper })

    let response
    await act(async () => {
      response = await result.current.createBlog({ title: 'A' }, false)
    })

    expect(response.success).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })

  it('posts the article and image', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { success: true, message: 'Created' } })
    const { result } = renderHook(() => useCreateBlog(), { wrapper: hookWrapper })
    const image = new File(['img'], 'cover.png', { type: 'image/png' })

    let response
    await act(async () => {
      response = await result.current.createBlog({ title: 'Roadmap' }, image)
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledWith('/api/blog/add', expect.any(FormData))
    const formData = post.mock.calls[0][1]
    expect(formData.get('blog')).toBe(JSON.stringify({ title: 'Roadmap' }))
    expect(formData.get('image')).toBe(image)
  })
})
