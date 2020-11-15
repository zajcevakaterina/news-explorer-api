const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  getSavedArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

articlesRouter.get('/articles', getSavedArticles);
articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    url: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) return helpers.error('К сожалению, ссылка не прошла валидацию');
      return value;
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) return helpers.error('К сожалению, ссылка не прошла валидацию');
      return value;
    }),
  }),
}), createArticle);

articlesRouter.delete('/articles/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), deleteArticle);

module.exports = articlesRouter;
