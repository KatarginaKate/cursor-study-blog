import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { commentApi } from '../../../api'

export function useComments(blogId) {
  const { t } = useTranslation()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    if (!blogId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await commentApi.getByBlogId(blogId)

      if (response.data.success) {
        setComments(response.data.comments || [])
      } else {
        toast.error(response.data.message || t('messages.error.fetchComments'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.fetchComments'))
    } finally {
      setLoading(false)
    }
  }, [blogId, t])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = async (commentData) => {
    if (!blogId) return false

    setSubmitting(true)

    try {
      const response = await commentApi.add({
        blogId,
        name: commentData.name,
        content: commentData.content
      })

      if (response.data.success) {
        toast.success(response.data.message || t('messages.success.commentAdded'))
        await fetchComments()
        return true
      }

      toast.error(response.data.message || t('messages.error.addComment'))
      return false
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('messages.error.addComment'))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { comments, loading, submitting, addComment, refetch: fetchComments }
}
