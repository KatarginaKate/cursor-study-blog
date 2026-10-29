import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiRequest } from './useApiRequest'

describe('useApiRequest', () => {
  it('returns the successful payload and toasts the message', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: { success: true, message: 'Saved' } })
    const { result } = renderHook(() => useApiRequest())

    let response
    await act(async () => {
      response = await result.current.execute(apiCall)
    })

    expect(response).toEqual({ success: true, data: { success: true, message: 'Saved' } })
    expect(toast.success).toHaveBeenCalledWith('Saved')
  })

  it('returns the body message when success is false', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: { success: false, message: 'Denied' } })
    const { result } = renderHook(() => useApiRequest())

    let response
    await act(async () => {
      response = await result.current.execute(apiCall)
    })

    expect(response).toEqual({ success: false, message: 'Denied' })
    expect(result.current.error).toBe('Denied')
    expect(toast.error).toHaveBeenCalledWith('Denied')
  })

  it('returns the thrown error message', async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useApiRequest())

    let response
    await act(async () => {
      response = await result.current.execute(apiCall)
    })

    expect(response.success).toBe(false)
    expect(response.message).toBe('offline')
    expect(toast.error).toHaveBeenCalledWith('offline')
  })
})
