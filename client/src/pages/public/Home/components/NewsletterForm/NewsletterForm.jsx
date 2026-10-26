import { useState } from 'react'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { validateEmail } from '@/utils/validators'
import './NewsletterForm.css'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      toast.error(t('messages.error.invalidEmail'))
      return
    }

    setLoading(true)
    setTimeout(() => {
      toast.success(t('newsletter.successMessage'))
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="newsletter-form-section">
      <h2>{t('newsletter.title')}</h2>
      <p>{t('newsletter.description')}</p>
      <form
        className="newsletter-form"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <Input
          size="large"
          placeholder={t('newsletter.placeholder')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          type="primary"
          htmlType="submit"
          className="newsletter-submit"
          loading={loading}
        >
          {t('common.subscribe')}
        </Button>
      </form>
    </section>
  )
}

export default NewsletterForm
