const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const doctorsController = require('../controllers/doctors-controllers');

const router = express.Router();

router.get('/', doctorsController.getDoctors);

router.post('/signup',
[
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 6 })
],
doctorsController.signup
);

router.post('/login', doctorsController.login);


router.use(checkAuth);
router.get('/appointments', doctorsController.getAllAppointments);

module.exports = router;
