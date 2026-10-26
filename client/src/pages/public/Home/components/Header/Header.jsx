import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import './Header.css'

function Header() {
  const { navigate, token } = useAppContext()
  const { t } = useTranslation()

  const startWriting = () => {
    navigate(token ? ROUTES.ADMIN_ADD_BLOG : ROUTES.REGISTER)
  }

  return (
    <section className="header-section">
      <div className="header-content">
        <h1 className="header-title">
          <span>{t('header.title')}</span> {t('header.titleHighlight')} {t('header.titleEnd')}
        </h1>
        <p className="header-description">{t('header.description')}</p>
        <Button type="primary" className="header-cta" onClick={startWriting}>
          {t('header.startWriting')}
        </Button>
      </div>
    </section>
  )
}

export default Header
