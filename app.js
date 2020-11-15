const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const NotFoundErr = require('./errors/not-found-error');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Пожалуйста, попробуйте позже',
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);

app.use(cors());

app.use(bodyParser.json());

app.use(requestLogger);

const userJoiSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};

app.post('/signup', celebrate(userJoiSchema), createUser);

app.post('/signin', celebrate(userJoiSchema), login);

app.use(auth);

app.use(articlesRouter);
app.use(usersRouter);

app.all('*', (req, res, next) => {
  next(new NotFoundErr({ message: 'Запрашиваемый ресурс не найден' }));
});

app.use(errorLogger);

// обработчик celebrate для ошибок
app.use(errors());

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: `К сожалению, на сервере произошла ошибка: ${err.message}` });
  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
