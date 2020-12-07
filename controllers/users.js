const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const AuthErr = require('../errors/auth-error');

const getUserById = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundErr('Нет пользователя с таким id');
    }
    res.status(200).send(user);
  })
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      } else next(err);
    })
    .then((user) => res.send({ message: `Пользователь c email ${user.email} успешно зарегистрирован` }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthErr(err.message);
    })
    .catch(next);
};

module.exports = {
  getUserById,
  createUser,
  login,
};
