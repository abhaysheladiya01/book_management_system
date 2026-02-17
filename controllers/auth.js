require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/user");
const authHelper = require('../helpers/auth');



const {
  hasValidationErrors,
  renderFormWithValidationErrors,
  getFlashMessage,
} = require("../helpers/form");
const {
  hashPassword,
  comparePasswords,
  generateToken,
} = require("../helpers/auth");
const { sendEmail } = require("../helpers/email");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: getFlashMessage(req, "error"),
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: getFlashMessage(req, "error"),
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const errors = hasValidationErrors(req);
  if (errors) {
    return renderFormWithValidationErrors(
      res,
      "auth/login",
      { path: "/login", pageTitle: "Login" },
      req.body,
      errors,
    );
  }

  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      return comparePasswords(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.userId = user._id;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid email or password.");
        res.redirect("/login");
      });
    })
   .catch(err => authHelper.handleError(err, next));

};

exports.postSignup = (req, res, next) => {
  const errors = hasValidationErrors(req);
  if (errors) {
    return renderFormWithValidationErrors(
      res,
      "auth/signup",
      { path: "/signup", pageTitle: "Signup" },
      req.body,
      errors,
    );
  }

  const { email, password } = req.body;
  hashPassword(password)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      sendEmail({
        to: email,
        subject: "Signup succeeded",
        html: "<h1>You successfully signed up!</h1>",
      });
      res.redirect("/login");
    })
  .catch(err => authHelper.handleError(err, next));

};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    errorMessage: getFlashMessage(req, "error"),
  });
};

exports.postReset = (req, res, next) => {
  generateToken()
    .then((token) => {
      return User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then(() => token);
      });
    })
    .then((token) => {
      sendEmail({
        to: req.body.email,
        subject: "Password reset",
        html: `<p>You requested a password reset</p><p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>`,
      });
      res.redirect("/");
    })
.catch(err => authHelper.handleError(err, next));

};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) return res.redirect("/");
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: getFlashMessage(req, "error"),
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
.catch(err => authHelper.handleError(err, next));

};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) return res.status(400).send("Invalid or expired token.");
      return hashPassword(password).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
      });
    })
    .then(() => res.redirect("/login"))
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while resetting the password.");
    });
};
