const mongoose = require('mongoose');

const commonFields = {
    content: { type: String, required: [true, 'Content is required.'] },
    image_url: { type: String, default: '', validate: /^https?:\/\// },
    path: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
};

const commentSchema = new mongoose.Schema(
    {
        ...commonFields,
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
    }, { timestamps: true }
)

const subCommentSchema = new mongoose.Schema(
    {
        ...commonFields,
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: true
        },
    }, { timestamps: true }
)

commentSchema.index({ post_id: 1, created_at: -1 });
subCommentSchema.index({ post_id: 1, created_at: -1 });

const Comment = mongoose.model('Comment', commentSchema);
const SubComment = mongoose.model('SubComment', subCommentSchema);

module.exports = { Comment, SubComment };