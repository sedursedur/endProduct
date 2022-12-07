const express = require('express');
const { check } = require('express-validator');

const appointmentsControllers = require('../controllers/appointments-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/patients/:uid', appointmentsControllers.getAppointmentsByPatientId);
router.post('/patients', appointmentsControllers.createAppointmentByPatient);
router.delete('/:aid', appointmentsControllers.deleteAppointmentById);
router.get('/:aid', appointmentsControllers.getAppointmentById);
router.patch('/:aid', appointmentsControllers.updateAppointmentById);


module.exports = router;
