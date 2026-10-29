import {
  classNames,
  debounce,
  getErrorMessage,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage
} from './helpers'

describe('helpers', () => {
  it('drops falsy class names', () => {
    expect(classNames('card', false, null, 'active')).toBe('card active')
  })

  it('prefers the API message, then the error message, then a fallback', () => {
    expect(getErrorMessage({ response: { data: { message: 'Taken' } }, message: 'fail' })).toBe('Taken')
    expect(getErrorMessage({ message: 'fail' })).toBe('fail')
    expect(getErrorMessage({})).toBe('Something went wrong')
  })

  it('returns the stored value and the default when JSON is invalid', () => {
    expect(saveToLocalStorage('user', { name: 'Ada' })).toBe(true)
    expect(getFromLocalStorage('user')).toEqual({ name: 'Ada' })

    localStorage.setItem('broken', '{')
    expect(getFromLocalStorage('broken', 'fallback')).toBe('fallback')
  })

  it('returns false when storage throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full')
    })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('full')
    })

    expect(saveToLocalStorage('user', { name: 'Ada' })).toBe(false)
    expect(removeFromLocalStorage('user')).toBe(false)
  })

  it('calls the debounced function once after the delay', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced('a')
    debounced('b')
    vi.advanceTimersByTime(199)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('b')
    vi.useRealTimers()
  })
})
