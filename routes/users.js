const usersRouter = require('express').Router();

const {
  getUserById,
} = require('../controllers/users');

usersRouter.get('/users/me', getUserById);

module.exports = usersRouter;
