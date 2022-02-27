const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Вы пытаетесь удалить чужой фильм'));
      } return Movie.findByIdAndRemove(movieId)
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Фильм с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};
