const express = require('express');
const { check } = require('express-validator');

const patientsController = require('../controllers/patients-controllers');

const router = express.Router();

router.get('/signup', patientsController.getDoctors);

router.post('/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  patientsController.signup
);

router.post('/login', patientsController.login);

module.exports = router;
