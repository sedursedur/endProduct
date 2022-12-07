const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  feedback: { type: String, default: " " },
  status: { type: Boolean, default: true },
  patientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Patient' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
