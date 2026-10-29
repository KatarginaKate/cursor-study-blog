import { act, renderHook } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  it('clears a field error when that field changes', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.setFieldError('name', 'Required')
    })
    act(() => {
      result.current.handleChange('name', 'Ada')
    })

    expect(result.current.values.name).toBe('Ada')
    expect(result.current.errors.name).toBeNull()
  })

  it('does not submit when validation fails', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useForm({ name: '' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, () => ({ name: 'Required' }))
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBe('Required')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('submits the current values', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useForm({ name: 'Ada' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit)
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' })
  })

  it('restores the initial values', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.handleChange('name', 'Ada')
      result.current.setFieldError('name', 'Nope')
    })
    act(() => {
      result.current.resetForm()
    })

    expect(result.current.values).toEqual({ name: '' })
    expect(result.current.errors).toEqual({})
  })
})
