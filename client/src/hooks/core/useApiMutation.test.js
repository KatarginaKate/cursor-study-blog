import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiMutation } from './useApiMutation'

describe('useApiMutation', () => {
  it('toasts a successful mutation', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: { success: true, message: 'Done' } })
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall)
    })

    expect(response.success).toBe(true)
    expect(toast.success).toHaveBeenCalledWith('Done')
  })

  it('toasts an error message from a failed response', async () => {
    const apiCall = vi.fn().mockRejectedValue({ response: { data: { message: 'Nope' } } })
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall)
    })

    expect(response).toEqual({ success: false, message: 'Nope' })
    expect(toast.error).toHaveBeenCalledWith('Nope')
  })

  it('does not call the API when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const apiCall = vi.fn()
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall, { confirmMessage: 'Delete?' })
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('calls the API after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const apiCall = vi.fn().mockResolvedValue({ data: { success: true, message: 'Deleted' } })
    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(apiCall, { confirmMessage: 'Delete?' })
    })

    expect(apiCall).toHaveBeenCalledTimes(1)
  })
})
