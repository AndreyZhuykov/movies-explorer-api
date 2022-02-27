const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.send({
      data: {
        name,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.editUser = (req, res, next) => {
  const { name } = req.body;
  const { password } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, password }, { new: true, runValidator: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 401) {
        next(new UnauthorizedError('Неавторизованный пользователь'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};
