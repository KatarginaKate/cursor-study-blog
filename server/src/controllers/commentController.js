import mongoose from 'mongoose'
import Comment from '../models/Comment.js'
import Blog from '../models/Blog.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

export const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params

  if (!isValidId(blogId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.MISSING_FIELDS
    })
  }

  const blog = await Blog.findById(blogId)
  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: ERROR_MESSAGES.BLOG_NOT_FOUND
    })
  }

  const comments = await Comment.find({ blog: blogId, isApproved: true })
    .sort({ createdAt: -1 })
    .lean()

  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const addComment = asyncHandler(async (req, res) => {
  const { blogId, name, content } = req.body

  const blog = await Blog.findById(blogId)
  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: ERROR_MESSAGES.BLOG_NOT_FOUND
    })
  }

  const comment = await Comment.create({
    blog: blogId,
    name,
    content,
    isApproved: false
  })

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.COMMENT_ADDED,
    comment
  })
})

export const getAllCommentsAdmin = asyncHandler(async (req, res) => {
  const comments = await Comment.find({})
    .populate('blog', 'title')
    .sort({ createdAt: -1 })
    .lean()

  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

const updateApproval = (isApproved, message) => asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id || !isValidId(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.MISSING_FIELDS
    })
  }

  const comment = await Comment.findById(id)
  if (!comment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: ERROR_MESSAGES.COMMENT_NOT_FOUND
    })
  }

  comment.isApproved = isApproved
  await comment.save()

  res.json({ success: true, message })
})

export const approveComment = updateApproval(true, SUCCESS_MESSAGES.COMMENT_APPROVED)

export const unapproveComment = updateApproval(false, SUCCESS_MESSAGES.COMMENT_UNAPPROVED)

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id || !isValidId(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.MISSING_FIELDS
    })
  }

  const comment = await Comment.findByIdAndDelete(id)
  if (!comment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: ERROR_MESSAGES.COMMENT_NOT_FOUND
    })
  }

  res.json({ success: true, message: SUCCESS_MESSAGES.COMMENT_DELETED })
})
