const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/movies', createMovie);
router.delete('/movies/_id', deleteMovie);

module.exports = router;
