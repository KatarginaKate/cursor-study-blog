export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  BLOG_DETAIL: '/blog/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ADD_BLOG: '/admin/addBlog',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_COMMENTS: '/admin/comments'
}

export const getBlogDetailPath = (id) => `/blog/${id}`
