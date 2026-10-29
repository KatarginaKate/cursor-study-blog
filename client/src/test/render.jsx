import { render } from '@testing-library/react'
import { ConfigProvider } from 'antd'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import i18n from '@/i18n'
import { AppProvider } from '@/context/AppContext'

export function renderWithProviders(ui, { route = '/', path = '*' } = {}) {
  return render(
    <ConfigProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[route]}>
          <AppProvider>
            <Routes>
              <Route path={path} element={ui} />
            </Routes>
          </AppProvider>
        </MemoryRouter>
      </I18nextProvider>
    </ConfigProvider>
  )
}

export function hookWrapper({ children }) {
  return (
    <MemoryRouter>
      <AppProvider>{children}</AppProvider>
    </MemoryRouter>
  )
}
