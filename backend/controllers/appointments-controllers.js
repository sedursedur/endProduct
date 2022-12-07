const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Appointment = require('../models/appointment');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');


const getAppointmentsByPatientId = async (req, res, next) => {
  const userId = req.params.uid;
  
  let userWithAppointments;
  try {
    userWithAppointments = await Patient.findById(userId).populate('appointments');
  } catch (err) {
    return next(new HttpError('Bir hata olustu, lutfen tekrar deneyin.', 500));
  }
  

  if (!userWithAppointments || userWithAppointments.appointments.length === 0) {
    return next(new HttpError('Randevu bulunamamistir.', 404));
  }
  
  res.json({
    appointments: userWithAppointments.appointments.map(a => a.toObject({ getters: true }))
  });
};

const createAppointmentByPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Girdiginiz verileri kontrol ediniz.', 422));
  }
  
  const { date, description } = req.body;
  
  const newAppointment = new Appointment({
    date,
    description,
    patientId: req.userData.userId
  });
  
  let patient;
  try {
    patient = await Patient.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError('Bir hata olustu.', 500));
  }
  
  if (!patient) {
    return next(new HttpError('Bir hata olustu.', 404));
  }
  
  await newAppointment.save();
  patient.appointments.push(newAppointment);
  await patient.save();
  
  res.status(201).json({ appointment: newAppointment });
};

const deleteAppointmentById = async (req, res, next) => {
  const appointmentId = req.params.aid;

  let appointment;
  try {
    appointment = await Appointment.findById(appointmentId).populate('patientId');
  } catch (err) {
    return next(new HttpError('Hata olustu, randevuyu silemiyoruz.', 500));
  }

  if (!appointment) {
    return next(new HttpError('Bu id ile bir randevu bulunamamistir.', 404));
  }

  await appointment.remove();
  appointment.patientId.appointments.pull(appointment);
  await appointment.patientId.save();

  res.status(200).json({ message: 'Randevu silindi' });
};


const getAppointmentById = async (req, res, next) => {
  const appointmentId = req.params.aid;

  let appointment;
  try {
    appointment = await Appointment.findById(appointmentId);
  } catch (err) {
    return next(new HttpError('Hata olustu, randevuyu silemiyoruz.', 500));
  }

  if (!appointment) {
    return next(new HttpError('Bu id ile bir randevu bulunamamistir.', 404));
  }

  res.status(200).json({appointment: appointment.toObject({getters: true})});
};

const updateAppointmentById = async (req, res, next) => {
  const { feedback, status } = req.body;

  const appointmentId = req.params.aid;

  let appointment;
  try {
    appointment = await Appointment.findById(appointmentId);
  } catch (err) {
    const error = new HttpError('Hata olustu, guncelleme gecersiz.', 500);
    return next(error);
  }


  appointment.feedback = feedback;
  appointment.status = status;

  try {
    await appointment.save();
  } catch (err) {
    return next(new HttpError('Hata olustu, guncelleme gecersiz.', 500));
    
  }

  res.status(200).json({ appointment: appointment.toObject({ getters: true }) });
};

exports.getAppointmentsByPatientId = getAppointmentsByPatientId;
exports.createAppointmentByPatient = createAppointmentByPatient;
exports.deleteAppointmentById = deleteAppointmentById;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointmentById = updateAppointmentById;
