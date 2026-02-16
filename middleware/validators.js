const { body, check, validationResult } = require('express-validator');
const User = require('../models/user');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationErrors = errors.array();
  }
  next();
};

exports.productValidation = [
  body('title').isString().isLength({ min: 3 }).trim(),
  body('imageUrl').isURL().withMessage('Please enter a valid URL.'),
  body('price').isFloat().withMessage('Please enter a valid price.'),
  body('description').isLength({ min: 5, max: 400 }).trim(),
  handleValidation
];

exports.signupValidation = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom(value => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) return Promise.reject('Email already exists.');
      });
    })
    .normalizeEmail(),
  body('password').isLength({ min: 5 }).isAlphanumeric().trim(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords must match.');
    return true;
  }),
  handleValidation
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
  body('password').isLength({ min: 5 }).isAlphanumeric().trim(),
  handleValidation
];
