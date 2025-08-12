const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let result = await User.register(newUser, password);
    req.login(result, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully signed up!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Successfully logged in!");
  if (res.locals.redirectUrl) {
    return res.redirect(res.locals.redirectUrl);
  }
  res.redirect("/listings");
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Error logging out");
      return res.redirect("/listings");
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/login");
  });
};
