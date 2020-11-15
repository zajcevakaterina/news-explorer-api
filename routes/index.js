const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRoute = require('./users');
const articlesRoute = require('./articles');
const { createUser, login } = require('../controllers/users');
const NotFoundErr = require('../errors/not-found-error');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

router.use(auth);
router.use('/users', usersRoute);
router.use('/articles', articlesRoute);
router.use((req, res, next) => {
  next(new NotFoundErr({ message: 'Запрашиваемый ресурс не найден' }));
});

module.exports = router;
