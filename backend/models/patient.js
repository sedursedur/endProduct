const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  doctorId: { type: mongoose.Types.ObjectId, required: true, ref: 'Doctor' },
  appointments: [{ type: mongoose.Types.ObjectId, ref: 'Appointment' }]
});

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Patient', patientSchema);
