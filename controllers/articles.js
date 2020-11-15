const Article = require('../models/article');
const NotFoundErr = require('../errors/not-found-error');
const BadReqErr = require('../errors/bad-request-err');
const ForbiddenErr = require('../errors/forbidden-error');

const getSavedArticles = (req, res, next) => Article.find({})
  .then((articles) => {
    if (!articles) {
      throw new NotFoundErr('Статьи не найдены');
    }
    res.status(200).send({ data: articles });
  })
  .catch(next);

const createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const { _id } = req.user;
  return Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: _id,
  })
    .then((article) => res.status(200).send(article))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadReqErr(error.message);
      } else {
        next(error);
      }
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail(new NotFoundErr('Статья не найдена'))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenErr('Удалять можно только свои статьи');
      } else {
        Article.findByIdAndDelete(req.params.id)
          .then(() => res.status(200).send('Статья удалена'))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getSavedArticles,
  createArticle,
  deleteArticle,
};
