const { validationResult } = require('express-validator');

exports.getFlashMessage = (req, key) => {
  const message = req.flash(key);
  return message.length > 0 ? message[0] : null;
};

exports.hasValidationErrors = (req) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array();
};

exports.renderFormWithValidationErrors = (res, template, pageData, reqBody = {}, errors) => {
  return res.status(422).render(template, {
    ...pageData,
    hasError: true,
    validationErrors: errors,
    errorMessage: errors[0].msg,
    editing: pageData.editing || false,

    product: {
      title: reqBody.title || '',
      imageUrl: reqBody.imageUrl || '',
      price: reqBody.price || '',
      description: reqBody.description || '',
      _id: reqBody._id || ''
    },

    oldInput: {
      email: reqBody.email || '',
      password: reqBody.password || '',
      confirmPassword: reqBody.confirmPassword || ''
    }
  });
};

