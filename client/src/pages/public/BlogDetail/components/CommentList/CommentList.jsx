import { Avatar, Empty } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import './CommentList.css'

function CommentList({ comments }) {
  const { t } = useTranslation()

  if (comments.length === 0) {
    return <Empty className="comment-empty" description={t('comment.noComments')} />
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <article key={comment._id} className="comment-card">
          <Avatar size={36} icon={<UserOutlined />} className="comment-avatar" />
          <div className="comment-body">
            <div className="comment-meta">
              <span>{comment.name}</span>
              <time dateTime={comment.createdAt}>
                {moment(comment.createdAt).format('DD.MM.YYYY')}
              </time>
            </div>
            <p>{comment.content}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default CommentList
