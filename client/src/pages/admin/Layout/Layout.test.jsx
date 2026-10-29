import { screen } from '@testing-library/react'
import { ConfigProvider } from 'antd'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { render } from '@testing-library/react'
import Layout from './Layout'

describe('Layout', () => {
  it('renders the sidebar and the child route', () => {
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/admin']}>
          <AppProvider>
            <Routes>
              <Route path="/admin" element={<Layout />}>
                <Route index element={<p>Child page</p>} />
              </Route>
            </Routes>
          </AppProvider>
        </MemoryRouter>
      </ConfigProvider>
    )

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Child page')).toBeInTheDocument()
  })
})
