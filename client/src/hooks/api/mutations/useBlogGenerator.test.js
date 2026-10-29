import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useBlogGenerator } from './useBlogGenerator'

describe('useBlogGenerator', () => {
  it('does not call the API for an empty title', async () => {
    const post = vi.spyOn(axios, 'post')
    const { result } = renderHook(() => useBlogGenerator(), { wrapper: hookWrapper })

    let response
    await act(async () => {
      response = await result.current.generateContent('   ')
    })

    expect(response.success).toBe(false)
    expect(post).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Please enter a title')
  })

  it('posts the title prompt', async () => {
    const post = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { success: true, message: 'Content generated successfully!', content: 'Hello **Ada**' }
    })
    const { result } = renderHook(() => useBlogGenerator(), { wrapper: hookWrapper })

    let response
    await act(async () => {
      response = await result.current.generateContent('Roadmap')
    })

    expect(post).toHaveBeenCalledWith('/api/blog/generate', { prompt: 'Roadmap' })
    expect(response.success).toBe(true)
  })
})
