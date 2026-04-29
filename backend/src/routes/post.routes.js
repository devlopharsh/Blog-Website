const express = require('express');
const router = express.Router();

const controller = require('../controllers/post.controller');
const validate = require('../middlewares/validate.middleware');
const {
  createPostSchema,
  createMultiplePostsSchema,
  updatePostSchema,
} = require('../validations/post.validation');

router.post('/', validate(createPostSchema), controller.createPost);
router.post('/bulk', validate(createMultiplePostsSchema), controller.createMultiplePosts);

router.get('/', controller.getPosts);

router.get('/export', controller.exportCSV);

router.get('/:id', controller.getPost);

router.put('/:id', validate(updatePostSchema), controller.updatePost);

router.delete('/:id', controller.deletePost);

module.exports = router;
