const { Joi, celebrate } = require('celebrate');

const linkRegularExpression = /^(https?:\/\/)?(www.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?$/;

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const movieValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(60).required(),
    director: Joi.string().min(2).max(99).required(),
    duration: Joi.number().min(2).max(30).required(),
    year: Joi.string().min(4).max(10).required(),
    description: Joi.string().min(2).required(),
    image: Joi.string().required().pattern(linkRegularExpression),
    trailerLink: Joi.string().required().pattern(linkRegularExpression),
    thumbnail: Joi.string().required().pattern(linkRegularExpression),
    nameRU: Joi.string().min(2).required(),
    nameEN: Joi.string().min(2).required(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const userDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports = {
  loginValidation,
  userValidation,
  userDataValidation,
  userIdValidation,
  movieValidation,
  movieIdValidation,
};
