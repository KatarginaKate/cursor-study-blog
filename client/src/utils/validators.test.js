import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl
} from './validators'

describe('validators', () => {
  it('accepts a normal email and rejects a missing domain', () => {
    expect(validateEmail('ada@studysprint.com')).toBe(true)
    expect(validateEmail('ada@studysprint')).toBe(false)
  })

  it('rejects blank required values', () => {
    expect(validateRequired('Ada')).toBe(true)
    expect(validateRequired('   ')).toBe(false)
    expect(validateRequired('')).toBe(false)
  })

  it('checks minimum and maximum length', () => {
    expect(validateMinLength('hello', 5)).toBe(true)
    expect(validateMinLength('hi', 5)).toBe(false)
    expect(validateMaxLength('hello', 5)).toBe(true)
    expect(validateMaxLength('hello!', 5)).toBe(false)
  })

  it('accepts an absolute URL and rejects plain text', () => {
    expect(validateUrl('https://studysprint.com/blog')).toBe(true)
    expect(validateUrl('not a url')).toBe(false)
  })
})
