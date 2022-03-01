require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHendler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { loginValidation, userValidation } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);
app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError('Страницы не сушествует'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHendler);

mongoose.connect('mongodb://localhost:27017/moviesdb', {
});

app.listen(PORT);
