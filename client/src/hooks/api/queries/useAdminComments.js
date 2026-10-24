import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

export function useAdminComments() {
  const { axios } = useAppContext()
  const { t } = useTranslation()

  const { data, loading, error, refetch } = useApiQuery(
    () => axios.get(API_ENDPOINTS.ADMIN_COMMENTS),
    {
      errorMessage: t('messages.error.fetchComments')
    }
  )

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch
  }
}
