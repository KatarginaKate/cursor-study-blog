import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true })

commentSchema.index({ blog: 1, createdAt: -1 })
commentSchema.index({ createdAt: -1 })

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
