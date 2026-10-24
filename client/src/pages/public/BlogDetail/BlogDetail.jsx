import React from 'react'
import { useParams } from 'react-router-dom'
import { Flex, Spin, theme } from 'antd'
import { Navbar, Footer, Loader } from '@/components'
import { useBlog, useComments } from '@/hooks'
import { LAYOUT } from '@/constants/ui'
import { BlogHeader, BlogContent, CommentForm, CommentList } from './components'
import './BlogDetail.css'

function BlogDetail() {
  const { id } = useParams()
  const { blog, loading: blogLoading } = useBlog(id)
  const { comments, loading: commentsLoading, submitting, addComment } = useComments(id)
  const { token } = theme.useToken()

  if (blogLoading || !blog) {
    return <Loader />
  }

  return (
    <Flex
      vertical
      style={{ background: token.colorBgBase, minHeight: '100vh' }}
    >
      <Navbar />

      <Flex
        vertical
        align="center"
        gap={token.marginXL * 2}
        style={{ flex: 1, padding: `${token.marginXL * 2}px 0` }}
      >
        <Flex
          vertical
          align="center"
          gap={token.marginXL}
          style={{ width: '100%', maxWidth: 1376, padding: `0 ${token.paddingLG}px` }}
        >
          <BlogHeader blog={blog} />

          <BlogContent content={blog.description} />

          <Flex
            vertical
            gap="large"
            className="blog-detail-comments"
            style={{ maxWidth: LAYOUT.COMMENTS_MAX_WIDTH }}
          >
            <CommentForm onSubmit={addComment} submitting={submitting} />
            {commentsLoading ? (
              <Flex justify="center">
                <Spin />
              </Flex>
            ) : (
              <CommentList comments={comments} />
            )}
          </Flex>
        </Flex>
      </Flex>

      <Footer />
    </Flex>
  )
}

export default BlogDetail

