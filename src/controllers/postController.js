const authenticateUser = require('../middleware/authUser');
const User = require('../models/accounts');
const Post = require('../models/posts');
const PostModel = require('../models/posts')

const PostController = {
    getAllPosts: [authenticateUser, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const posts = await PostModel.find()
                .select('_id content image_url created_by created_at')
                .skip(skip)
                .limit(limit);

            const count = await PostModel.countDocuments();
            res.status(200).json({
                posts,
                count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }],

    getPostById: [authenticateUser, async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }
            res.status(200).json({
                id: post.id,
                content: post.content,
                image_url: post.image_url,
                created_by: post.created_by,
                created_at: post.created_at
            })
        } catch (err) {
            console.error();
        }
    }],

    createPost: [authenticateUser, async (req, res) => {
        try {
            const post = new Post({
                content: req.body.content,
                image_url: req.body.image_url,
                created_by: req.user.userId,
                updated_by: req.user.userId
            });

            await post.save();

            res.json({
                id: post.id,
                content: post.content,
                created_at: post.created_at
            })

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }],

    updatePost: [authenticateUser, async (req, res) => {
        try {
            const { content, image_url } = req.body;
            const post = await Post.find({ _id: req.params.id, created_by: req.user.userId })

            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            const updated_post = await Post.findByIdAndUpdate(
                req.params.id,
                { content, image_url },
                { new: true }
            )
            if (!updated_post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json({
                id: updated_post.id,
                content: updated_post.content,
                image_url: updated_post.image_url,
                created_by: updated_post.created_by,
                created_at: updated_post.created_at
            })
            w
        } catch (err) {
            console.error(err);
        }
    }],

    deletePost: [authenticateUser, async (req, res) => {
        try {
            const post = await Post.find({ _id: req.params.id, created_by: req.user.userId })

            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            await Post.deleteOne({ _id: req.params.id });
            res.status(204).json({ message: 'Post deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }]
};

module.exports = PostController;