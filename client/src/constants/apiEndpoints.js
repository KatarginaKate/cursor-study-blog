export const API_ENDPOINTS = {
  // Blog endpoints
  BLOGS_ALL: '/api/blog/all',
  BLOG_BY_ID: (id) => `/api/blog/${id}`,
  BLOG_CREATE: '/api/blog',
  BLOG_UPDATE: (id) => `/api/blog/${id}`,
  BLOG_DELETE: (id) => `/api/blog/${id}`,
  BLOG_PUBLISH: '/api/blog/publish',
  BLOG_UNPUBLISH: '/api/blog/unpublish',
  
  // Comment endpoints
  COMMENTS_BY_BLOG: (blogId) => `/api/comment/blog/${blogId}`,
  COMMENT_ADD: '/api/comment/add',
  COMMENT_APPROVE: '/api/admin/comments/approve',
  COMMENT_UNAPPROVE: '/api/admin/comments/unapprove',
  COMMENT_DELETE: '/api/admin/comments/delete',

  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_BLOGS: '/api/admin/blogs',
  ADMIN_COMMENTS: '/api/admin/comments'
}

