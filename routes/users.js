const router = require('express').Router();
const {
  editUser,
  getUserId,
} = require('../controllers/users');
const { userDataValidation } = require('../middlewares/validation');

router.get('/users/me', getUserId);
router.patch('/users/me', userDataValidation, editUser);

module.exports = router;
