import React from 'react'
import { Form, Input, Button, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import './CommentForm.css'

const { Title } = Typography
const { TextArea } = Input

const NAME_MAX = 80
const CONTENT_MAX = 650

function CommentForm({ onSubmit, submitting }) {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const handleFinish = async (values) => {
    const didSave = await onSubmit({
      name: values.name.trim(),
      content: values.content.trim()
    })

    if (didSave) {
      form.resetFields()
    }
  }

  return (
    <Flex vertical gap="middle" className="comment-form">
      <Title level={2} className="comment-form-heading">
        {t('comment.sectionTitle')}
      </Title>

      <Title level={4} className="comment-form-title">
        {t('comment.formTitle')}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        className="comment-form-fields"
      >
        <Form.Item
          name="name"
          rules={[
            { required: true, whitespace: true, message: t('validation.nameRequired') },
            { max: NAME_MAX, message: t('validation.nameMax') }
          ]}
        >
          <Input
            size="large"
            maxLength={NAME_MAX}
            placeholder={t('comment.namePlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="content"
          rules={[
            { required: true, whitespace: true, message: t('validation.commentRequired') },
            { max: CONTENT_MAX, message: t('validation.commentMax') }
          ]}
        >
          <TextArea
            rows={6}
            maxLength={CONTENT_MAX}
            showCount={{
              formatter: ({ count, maxLength }) => `${count}/${maxLength}`
            }}
            placeholder={t('comment.contentPlaceholder')}
          />
        </Form.Item>

        <Form.Item className="comment-form-submit">
          <Button type="primary" htmlType="submit" loading={submitting}>
            {t('common.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default CommentForm
