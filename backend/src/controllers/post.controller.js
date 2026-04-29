const postService = require('../services/post.service');
const { exportToCSV } = require('../utils/csvExporter');

exports.createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.createMultiplePosts = async (req, res, next) => {
  try {
    const posts = await postService.createMultiplePosts(req.body);
    res.status(201).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const data = await postService.getPosts(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) throw { status: 404, message: 'Post not found' };

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

exports.exportCSV = async (req, res, next) => {
  try {
    const { posts } = await postService.getPosts(req.query);

    const csv = exportToCSV(posts);

    res.header('Content-Type', 'text/csv');
    res.attachment('posts.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
