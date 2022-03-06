require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorHendler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const DB_ADDRES = require('./utils/config');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000, MONGO_URL, NODE_ENV } = process.env;

app.use(bodyParser.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError('Страницы не сушествует'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHendler);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DB_ADDRES, () => {
});

app.listen(PORT);
