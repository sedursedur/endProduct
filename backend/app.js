const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const appointmentsRoutes = require('./routes/appointments-routes');
const patientsRoutes = require('./routes/patients-routes');
const doctorsRoutes = require('./routes/doctors-routes');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/appointments', appointmentsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/patients', patientsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/endProduct', {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
