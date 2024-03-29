const mongoose = require('mongoose');
const User = require('./accounts');

const postSchema = new mongoose.Schema(
    {
        content: { type: String, default: '', required: true },
        image_url: { type: String, default: '' },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }
)
postSchema.pre('save', async function () {
    try {
        console.log(this.created_by);
        const user = await User.findByIdAndUpdate(
            this.created_by,
            { $push: { posts: this._id } },
            { new: true }
        )
    } catch (err) {
        console.error(err);
    }
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;