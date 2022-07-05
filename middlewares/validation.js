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

const userDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const movieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(10000).required(),
    director: Joi.string().min(2).max(99).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(4).max(10).required(),
    description: Joi.string().min(2).required(),
    image: Joi.string().required().pattern(linkRegularExpression),
    trailerLink: Joi.string().required().pattern(linkRegularExpression),
    thumbnail: Joi.string().required().pattern(linkRegularExpression),
    movieId: Joi.String().required(),
    nameRU: Joi.string().min(2).required(),
    nameEN: Joi.string().min(2).required(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(),
  }),
});

module.exports = {
  loginValidation,
  userValidation,
  userDataValidation,
  movieValidation,
  movieIdValidation,
};
