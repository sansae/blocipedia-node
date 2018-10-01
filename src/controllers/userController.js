const userQueries = require("../db/queries.users.js");
const sgMail = require('@sendgrid/mail');
const passport = require("passport");
const User = require("../db/models").User;

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
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up! An email confirmation has been sent to you.");
          res.redirect("/");
        })
      }

      if (user) {
        userQueries.sendEmail(user);
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/signin");
  },

  signIn(req, res, next) {
    User.findOne({
      where: { email: req.body.email }
    })
    .then((user) => {
      if (!user) {
        req.flash("notice", `${req.body.email} does not exist`);
        res.redirect("/users/signin");
      } else {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err);
          }

          if (!user) {
            req.flash("notice", `Sign in failed. ${info.message}`);
            res.redirect("/users/signin");
          }

          req.logIn(user, function(err) {
            if (err) {
              return next("Sign in failed. I am from userController.js");
            }

            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          });
        })(req, res, next);
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgradeForm(req, res, next) {
    res.render("users/upgrade");
  }
}
