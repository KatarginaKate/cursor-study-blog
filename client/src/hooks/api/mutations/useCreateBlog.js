import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

export function useCreateBlog() {
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const createBlog = async (blogData, imageFile) => {
    const formData = new FormData()
    formData.append('blog', JSON.stringify(blogData))

    if (imageFile && typeof imageFile !== 'boolean') {
      formData.append('image', imageFile)
    }

    return mutate(
      () => axios.post(API_ENDPOINTS.BLOG_CREATE, formData),
      {
        successMessage: MESSAGES.SUCCESS_BLOG_CREATED,
        errorMessage: MESSAGES.ERROR_CREATE_BLOG
      }
    )
  }

  return {
    createBlog,
    isCreating: loading,
    inProgress: loading,
    error
  }
}
