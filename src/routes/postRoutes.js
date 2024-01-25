const express = require('express');
const router = express.Router();
const PostController = require("../controllers/postController");

router.get('', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.post('/create', PostController.createPost);
router.put('/update/:id', PostController.updatePost);
router.delete('/delete/:id', PostController.deletePost);

module.exports = router;