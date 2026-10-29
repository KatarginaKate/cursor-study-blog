import { act, renderHook } from '@testing-library/react'
import { axios } from '@/api'
import { hookWrapper } from '@/test/render'
import { useCommentActions } from './useCommentActions'

describe('useCommentActions', () => {
  it('approves a comment by id', async () => {
    const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { success: true, message: 'Approved' } })
    const { result } = renderHook(() => useCommentActions(), { wrapper: hookWrapper })

    let response
    await act(async () => {
      response = await result.current.approveComment('c1')
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledWith('/api/admin/approve-comment', { id: 'c1' })
  })

  it('does not delete when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const post = vi.spyOn(axios, 'post')
    const { result } = renderHook(() => useCommentActions(), { wrapper: hookWrapper })

    await act(async () => {
      await result.current.deleteComment('c1')
    })

    expect(post).not.toHaveBeenCalled()
  })
})
