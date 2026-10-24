import mongoose from 'mongoose'

const NAME_MAX = 80
const CONTENT_MAX = 650

export const validateCommentInput = (req, res, next) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
  const content = typeof req.body.content === 'string' ? req.body.content.trim() : ''
  const { blogId } = req.body
  const errors = []

  if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
    errors.push('A valid blog is required')
  }
  if (!name) {
    errors.push('Name is required')
  } else if (name.length > NAME_MAX) {
    errors.push('Name must be at most 80 characters')
  }
  if (!content) {
    errors.push('Comment is required')
  } else if (content.length > CONTENT_MAX) {
    errors.push('Comment must be at most 650 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    })
  }

  req.body.name = name
  req.body.content = content
  next()
}
