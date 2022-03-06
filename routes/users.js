const router = require('express').Router();
const {
  editUser,
  getUserId,
} = require('../controllers/users');
const { userDataValidation } = require('../middlewares/validation');

router.get('/me', getUserId);
router.patch('/me', userDataValidation, editUser);

module.exports = router;
