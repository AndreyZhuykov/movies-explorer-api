const router = require('express').Router();
const {
  editUser,
  getUserId,
} = require('../controllers/users');

router.get('/users/me', getUserId);
router.post('/users/me', editUser);

module.exports = router;
