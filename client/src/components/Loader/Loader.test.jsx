import { renderWithProviders } from '@/test/render'
import Loader from './Loader'

describe('Loader', () => {
  it('shows a loading status', () => {
    const { container } = renderWithProviders(<Loader />)
    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })
})
