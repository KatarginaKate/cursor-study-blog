import express from 'express'
import { getCommentsByBlog, addComment } from '../controllers/commentController.js'
import { validateCommentInput } from '../validators/commentValidator.js'
import { commentLimiter } from '../middleware/rateLimiter.js'

const commentRouter = express.Router()

commentRouter.get('/blog/:blogId', getCommentsByBlog)
commentRouter.post('/add', commentLimiter, validateCommentInput, addComment)

export default commentRouter
