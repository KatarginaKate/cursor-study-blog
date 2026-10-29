import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import AddBlog from './AddBlog'

const { createBlog } = vi.hoisted(() => ({
  createBlog: vi.fn()
}))

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useCreateBlog: () => ({ createBlog, isCreating: false }),
    useBlogGenerator: () => ({ generateContent: vi.fn(), isGenerating: false })
  }
})

vi.mock('quill', () => ({
  default: class Quill {
    constructor(element) {
      this.root = document.createElement('div')
      this.root.className = 'ql-editor'
      this.root.innerHTML = '<p><br></p>'
      element.appendChild(this.root)
    }
  }
}))

describe('AddBlog', () => {
  it('blocks publish when the title is missing', async () => {
    renderWithProviders(<AddBlog />)

    await userEvent.click(screen.getByRole('button', { name: 'Publish Article' }))

    expect(await screen.findByText('Please enter article title')).toBeInTheDocument()
    expect(createBlog).not.toHaveBeenCalled()
  })

  it('publishes a completed article', async () => {
    createBlog.mockResolvedValue({ success: true })
    renderWithProviders(<AddBlog />)

    await userEvent.type(screen.getByLabelText('Title'), 'Roadmap')
    await userEvent.type(screen.getByLabelText('Subtitle'), 'A short guide')
    document.querySelector('.ql-editor').innerHTML = '<p>Body copy</p>'

    const file = new File(['img'], 'cover.png', { type: 'image/png' })
    await userEvent.upload(document.querySelector('input[type="file"]'), file)
    await userEvent.click(screen.getByRole('button', { name: 'Publish Article' }))

    await waitFor(() => expect(createBlog).toHaveBeenCalled())
    expect(createBlog.mock.calls[0][0]).toMatchObject({
      title: 'Roadmap',
      subTitle: 'A short guide',
      isPublished: true
    })
    expect(createBlog.mock.calls[0][1]).toBe(file)
  })
})
