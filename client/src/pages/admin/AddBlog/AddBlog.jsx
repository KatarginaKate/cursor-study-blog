import React, { useState } from 'react'
import { Form, Input, Select, Upload, Button, Typography, Flex, Space, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { UPLOAD } from '@/constants/ui'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import '../shared/AdminTable.css'
import './AddBlog.css'

const { Title, Text } = Typography
const { TextArea } = Input

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const toHtml = (value) => {
  const trimmed = (value || '').trim()
  if (!trimmed) return ''
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function AddBlog() {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [image, setImage] = useState(null)
  const [fileList, setFileList] = useState([])
  const [imagePreview, setImagePreview] = useState(null)

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const resetForm = () => {
    form.resetFields()
    setImage(null)
    setFileList([])
    setImagePreview(null)
  }

  const handleGenerateContent = async () => {
    const title = form.getFieldValue('title')
    if (!title) {
      toast.error(t('messages.error.blogTitle'))
      return
    }

    const result = await generateContent(title)
    if (result.success && result.content) {
      form.setFieldValue('description', result.content)
    }
  }

  const onSubmitHandler = async (values) => {
    if (!image) {
      toast.error(t('messages.error.blogThumbnail'))
      return
    }

    const description = toHtml(values.description)
    if (!description) {
      toast.error(t('messages.error.blogDescription'))
      return
    }

    const result = await createBlog({
      title: values.title,
      subTitle: values.subTitle,
      description,
      category: values.category,
      isPublished: true
    }, image)

    if (result.success) {
      resetForm()
    }
  }

  const handleSaveDraft = async () => {
    const values = form.getFieldsValue()

    if (!values.title || values.title.trim().length < 3) {
      toast.error(t('messages.error.blogTitleMin'))
      return
    }

    const result = await createBlog({
      title: values.title,
      subTitle: values.subTitle || '',
      description: toHtml(values.description),
      category: values.category || '',
      isPublished: false
    }, image)

    if (result.success) {
      resetForm()
    }
  }

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        toast.error(t('messages.error.imageType'))
        return Upload.LIST_IGNORE
      }
      const isLt5M = file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB
      if (!isLt5M) {
        toast.error(t('messages.error.imageSize'))
        return Upload.LIST_IGNORE
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setImage(file)
      setFileList([file])
      return false
    },
    onRemove: () => {
      setImage(null)
      setFileList([])
      setImagePreview(null)
    },
    fileList,
    maxCount: 1,
    accept: UPLOAD.ACCEPTED_TYPES,
    showUploadList: false
  }

  return (
    <Flex vertical className="admin-add-blog">
      <Title level={1} className="admin-add-blog-title">
        {t('admin.addBlog.title')}
      </Title>

      <div className="admin-add-blog-form-wrap">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmitHandler}
        disabled={isGenerating}
        className="admin-add-blog-form"
      >
        <Form.Item label={t('admin.addBlog.uploadThumbnail')}>
          <Upload {...uploadProps} disabled={isGenerating} listType="picture-card" className="admin-upload">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="admin-upload-preview"
              />
            ) : (
              <Flex vertical align="center" justify="center">
                <PlusOutlined />
                <Text className="admin-upload-text">{t('admin.addBlog.uploadButton')}</Text>
              </Flex>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.titleLabel')}
          name="title"
          rules={[{ required: true, message: t('validation.titleRequired') }]}
        >
          <Input placeholder={t('admin.addBlog.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.subtitleLabel')}
          name="subTitle"
          rules={[{ required: true, message: t('validation.subtitleRequired') }]}
        >
          <Input placeholder={t('admin.addBlog.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.categoryLabel')}
          name="category"
          rules={[{ required: true, message: t('validation.categoryRequired') }]}
        >
          <Select placeholder={t('admin.addBlog.categoryPlaceholder')}>
            {BLOG_CATEGORIES.filter(cat => cat !== 'All').map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('admin.addBlog.bodyLabel')} required>
          <div className="admin-editor-wrapper">
            <Form.Item
              name="description"
              noStyle
              rules={[{ required: true, message: t('validation.descriptionRequired') }]}
            >
              <TextArea
                rows={8}
                placeholder={t('admin.addBlog.titlePlaceholder')}
                className="admin-body-input"
              />
            </Form.Item>
            <Button
              size="small"
              onClick={handleGenerateContent}
              disabled={isGenerating || isCreating}
              className="admin-editor-ai-button"
            >
              {t('admin.addBlog.generateAI')}
            </Button>
          </div>
        </Form.Item>

        <Form.Item className="admin-form-actions-item">
          <Space orientation="horizontal" size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              disabled={isCreating || isGenerating}
            >
              {t('admin.addBlog.publishButton')}
            </Button>
            <Button
              onClick={handleSaveDraft}
              loading={isCreating}
              disabled={isCreating || isGenerating}
              className="admin-draft-button"
            >
              {t('admin.addBlog.saveDraft')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {isGenerating && (
        <div className="admin-generate-overlay" aria-busy="true">
          <Spin size="large" />
        </div>
      )}
      </div>
    </Flex>
  )
}

export default AddBlog
