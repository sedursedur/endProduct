const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Veriler hatali, lutfen kontrol ediniz.', 422));
  }

  const { name, email, password, doctorId } = req.body;

  let existingUser;
  try {
    existingUser = await Patient.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Bir hata olustu, lutfen tekrar deneyiniz.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('Kullanici mevcut, lutfen giris yapiniz.', 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Kullanici olusturulamiyor, lutfen yeniden deneyiniz.', 500);
    return next(error);
  }

  const createdUser = new Patient({
    name,
    email,
    password: hashedPassword,
    doctorId,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Bir hata olustu, lutfen tekrar deneyiniz.', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Bir hata olustu, lutfen tekrar deneyiniz.', 500);
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await Patient.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Giris sirasinda bir hata olustu.', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Bilgiler hatali, lutfen kontrol ediniz.', 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Bir hata olustu, bilgilerinizi kontrol ediniz.', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Bilgiler hatali, lutfen kontrol ediniz.', 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Bir hata olustu, bilgilerinizi kontrol ediniz.', 500);
    return next(error);
  }

  res.status(200).json({userId: existingUser.id, email: existingUser.email, token: token});
};

const getDoctors = async (req, res, next) => {
  let doctors;
  try {
    doctors = await Doctor.find({}, '-password -__v');
  } catch (err) {
    return next(new HttpError('Bir hata olustu.', 500));
  }
  res.status(200).json({ doctors: doctors.map(d => d.toObject({ getters: true })) });
};

exports.signup = signup;
exports.login = login;
exports.getDoctors = getDoctors;
