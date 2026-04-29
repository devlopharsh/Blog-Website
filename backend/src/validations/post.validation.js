const Joi = require("joi");

exports.createPostSchema = Joi.object({
  title: Joi.string().min(3).required(),
  email: Joi.string().min(3).required(),
  shortDescription: Joi.string().max(500).required(),
  content: Joi.string().min(10).required(),
  author: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.string().optional(), // comma separated string
  imageUrl: Joi.string().uri().optional(),
  status: Joi.string().valid("on", "off").optional(),
});

exports.createMultiplePostsSchema = Joi.array()
  .items(exports.createPostSchema)
  .min(1)
  .required();

exports.updatePostSchema = Joi.object({
  title: Joi.string().min(3),
  email: Joi.string().min(3).required(),
  shortDescription: Joi.string().max(500),
  content: Joi.string().min(10),
  author: Joi.string(),
  category: Joi.string(),
  tags: Joi.string(),
  imageUrl: Joi.string().uri(),
  status: Joi.string().valid("on", "off"),
});
