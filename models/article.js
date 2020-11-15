// const bcrypt = require('bcryptjs');
const { isURL } = require('validator');
const mongoose = require('mongoose');

// const AuthErr = require('../errors/auth-error');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
      message: 'Неверная ссылка',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
      message: 'Неверная ссылка',
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

module.exports = mongoose.model('article', articleSchema);
