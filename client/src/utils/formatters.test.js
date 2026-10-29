import Moment from 'moment'
import {
  formatDate,
  truncateText,
  stripHtmlTags,
  truncateHtml
} from './formatters'

describe('formatters', () => {
  it('formats a fixed date', () => {
    const date = '2024-01-15'
    expect(formatDate(date)).toBe(Moment(date).format('MMMM Do YYYY'))
  })

  it('returns an empty string for missing text', () => {
    expect(truncateText('')).toBe('')
    expect(truncateText(null)).toBe('')
  })

  it('keeps short text and adds an ellipsis when text is too long', () => {
    expect(truncateText('short', 10)).toBe('short')
    expect(truncateText('abcdefghijk', 5)).toBe('abcde...')
  })

  it('strips tags before truncating HTML', () => {
    expect(stripHtmlTags('<p>Hello <strong>Ada</strong></p>')).toBe('Hello Ada')
    expect(truncateHtml('<p>Hello <strong>world</strong></p>', 5)).toBe('Hello...')
  })
})
