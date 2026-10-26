import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import './CommentForm.css'

const { TextArea } = Input

const MAX_COMMENT_LENGTH = 650

function readTokenName(token) {
  if (!token) return ''

  try {
    const segment = token.split('.')[1]
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
    return JSON.parse(json).name || ''
  } catch {
    return ''
  }
}

function CommentForm({ onSubmit, loading = false }) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const { token, navigate } = useAppContext()
  const location = useLocation()
  const { t } = useTranslation()
  const authorName = readTokenName(token)

  const handleSubmit = async (values) => {
    setSubmitting(true)

    const result = await onSubmit({
      name: authorName,
      content: values.content
    })

    if (result?.success) {
      form.resetFields()
    }

    setSubmitting(false)
  }

  if (!token) {
    return (
      <div className="comment-form">
        <h3>{t('comment.title')}</h3>
        <p>{t('comment.guestLead')}</p>
        <p>{t('comment.guestBody')}</p>
        <p>{t('comment.guestAccount')}</p>
        <div className="comment-auth-actions">
          <Button onClick={() => navigate(ROUTES.ADMIN, { state: { from: location.pathname } })}>
            {t('comment.logIn')}
          </Button>
          <Button type="primary" onClick={() => navigate(ROUTES.REGISTER)}>
            {t('comment.register')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="comment-form">
      <h3>{t('comment.title')}</h3>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="content"
          rules={[
            { required: true, message: t('validation.commentRequired') },
            { min: 5, message: t('validation.commentMin') }
          ]}
        >
          <TextArea
            placeholder={t('comment.contentPlaceholder')}
            rows={4}
            maxLength={MAX_COMMENT_LENGTH}
            showCount={{
              formatter: ({ count, maxLength }) => `${count}/${maxLength}`
            }}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading || submitting}
          disabled={!authorName}
        >
          {t('common.submit')}
        </Button>
      </Form>
    </div>
  )
}

export default CommentForm
