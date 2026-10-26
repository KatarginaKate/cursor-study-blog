import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { assets } from '@/assets/assets'
import './Navbar.css'

function Navbar() {
  const { navigate, token: authToken } = useAppContext()
  const { t } = useTranslation()

  const goToArticles = () => {
    if (window.location.pathname === ROUTES.HOME) {
      document.getElementById('recent-articles')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate(ROUTES.HOME)
  }

  return (
    <nav className="navbar">
      <div
        onClick={() => navigate(ROUTES.HOME)}
        className="navbar-logo"
      >
        <img src={assets.sprint} alt={t('common.appName')} />
        <span>{t('common.appName')}</span>
      </div>

      <div className="navbar-nav">
        <button type="button" className="navbar-link" onClick={goToArticles}>
          {t('nav.articles')}
        </button>
        {authToken ? (
          <Button
            type="primary"
            className="navbar-register"
            onClick={() => navigate(ROUTES.ADMIN)}
          >
            {t('nav.dashboard')}
          </Button>
        ) : (
          <>
            <Button className="navbar-login" onClick={() => navigate(ROUTES.ADMIN)}>
              {t('nav.login')}
            </Button>
            <Button
              type="primary"
              className="navbar-register"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              {t('nav.register')}
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
