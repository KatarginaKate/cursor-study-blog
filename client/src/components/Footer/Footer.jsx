import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { assets } from '@/assets/assets'
import './Footer.css'

function Footer() {
  const { navigate } = useAppContext()
  const { t } = useTranslation()

  const quickLinks = [
    { label: t('footer.allArticles'), onClick: () => navigate(ROUTES.HOME) },
    { label: t('nav.login'), onClick: () => navigate(ROUTES.ADMIN) },
    { label: t('nav.register'), onClick: () => navigate(ROUTES.REGISTER) }
  ]

  const socialLinks = [
    { label: t('footer.instagram'), href: '#' },
    { label: t('footer.twitter'), href: '#' },
    { label: t('footer.facebook'), href: '#' },
    { label: t('footer.youtube'), href: '#' }
  ]

  return (
    <footer className="footer">
      <div>
        <div className="footer-logo">
          <img src={assets.sprint} alt={t('common.appName')} />
          <span>{t('common.appName')}</span>
        </div>
        <p className="footer-copy">{t('common.copyright')}</p>
      </div>

      <div className="footer-links">
        <div>
          <h3>{t('footer.quickLinks')}</h3>
          <ul className="footer-link-list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a className="footer-link" onClick={link.onClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>{t('footer.followUs')}</h3>
          <ul className="footer-link-list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a className="footer-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
