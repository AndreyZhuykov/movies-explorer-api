require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorHendler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/rateLimit');
const DB_ADDRES = require('./utils/config');
const cors = require('./middlewares/cors');

const app = express();

const { PORT = 3000, MONGO_URL, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DB_ADDRES, () => {
});

app.use(bodyParser.json());
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHendler);

app.listen(PORT);
