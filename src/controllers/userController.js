const userQueries = require("../db/queries.users.js");
const sgMail = require('@sendgrid/mail');
const passport = require("passport");

module.exports = {
  signUpForm(req, res, next) {
    res.render("users/signup");
  },

  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {
        req.flash("notice", "You've successfully signed up! An email confirmation has been sent to you.");
        res.redirect("/");
      }

      if (user) {
        userQueries.sendEmail(user);
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/signin");
  },

  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/signin");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },
}
