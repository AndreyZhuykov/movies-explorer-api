const router = require('express').Router();
const { userValidation, loginValidation } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);

module.exports = router;
