const Post = require('../models/post.model');

const parseTags = (tags) => {
  if (!tags) return [];
  return tags.split(',').map((tag) => tag.trim());
};

exports.createPost = async (data) => {
  const postData = {
    ...data,
    tags: parseTags(data.tags),
  };

  return await Post.create(postData);
};

exports.createMultiplePosts = async (posts) => {
  const postsData = posts.map((post) => ({
    ...post,
    tags: parseTags(post.tags),
  }));

  return await Post.insertMany(postsData);
};

exports.updatePost = async (id, data) => {
  if (data.tags) {
    data.tags = parseTags(data.tags);
  }

  return await Post.findByIdAndUpdate(id, data, { new: true });
};

exports.getPosts = async (query) => {
  const { page = 1, limit = 10, search, author, category } = query;

  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  if (author) filter.author = author;
  if (category) filter.category = category;

  const posts = await Post.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Post.countDocuments(filter);

  return {
    posts,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

exports.getPostById = async (id) => {
  return await Post.findById(id);
};

exports.deletePost = async (id) => {
  return await Post.findByIdAndDelete(id);
};
