import { renderWithProviders } from '@/test/render'
import BlogContent from './BlogContent'

describe('BlogContent', () => {
  it('keeps allowed markup and removes a script tag', () => {
    const { container } = renderWithProviders(
      <BlogContent content={'<p>Safe text</p><script>alert(1)</script>'} />
    )
    const content = container.querySelector('.rich-text')

    expect(content.innerHTML).toContain('Safe text')
    expect(content.querySelector('script')).toBeNull()
  })
})
