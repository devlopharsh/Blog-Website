const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    email:{
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['on', 'off'],
      default: 'on',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);