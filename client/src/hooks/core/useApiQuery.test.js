import { act, renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiQuery } from './useApiQuery'

describe('useApiQuery', () => {
  it('stores a successful response', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: { success: true, blogs: ['one'] } })
    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => expect(result.current.data).toEqual({ success: true, blogs: ['one'] }))
    expect(result.current.error).toBeNull()
  })

  it('records an unsuccessful body and toasts it', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: { success: false, message: 'Denied' } })
    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => expect(result.current.error).toBe('Denied'))
    expect(toast.error).toHaveBeenCalledWith('Denied')
  })

  it('records a thrown error', async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error('offline'))
    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => expect(result.current.error).toBe('offline'))
    expect(toast.error).toHaveBeenCalledWith('offline')
  })

  it('does not call the API when disabled', () => {
    const apiCall = vi.fn()
    renderHook(() => useApiQuery(apiCall, { enabled: false }))
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('calls the API again on refetch', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: { success: true, blogs: [] } })
    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => expect(apiCall).toHaveBeenCalledTimes(1))
    await act(async () => {
      await result.current.refetch()
    })
    expect(apiCall).toHaveBeenCalledTimes(2)
  })
})
