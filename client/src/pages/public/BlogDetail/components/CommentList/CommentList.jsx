import React from 'react'
import { Empty, Flex, List, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { DATE_FORMATS } from '@/constants/ui'
import './CommentList.css'

const { Text, Paragraph } = Typography

function CommentList({ comments }) {
  const { t } = useTranslation()

  if (!comments.length) {
    return (
      <Empty
        description={t('comment.noComments')}
        className="comment-list-empty"
      />
    )
  }

  return (
    <List
      className="comment-list"
      dataSource={comments}
      renderItem={(comment) => (
        <List.Item className="comment-list-item">
          <Flex vertical gap="small" className="comment-list-body">
            <Flex justify="space-between" align="center" gap="small" wrap="wrap">
              <Text strong>{comment.name}</Text>
              <Text type="secondary">
                {moment(comment.createdAt).format(DATE_FORMATS.DISPLAY)}
              </Text>
            </Flex>
            <Paragraph className="comment-list-content">
              {comment.content}
            </Paragraph>
          </Flex>
        </List.Item>
      )}
    />
  )
}

export default CommentList
