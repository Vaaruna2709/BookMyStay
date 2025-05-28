
const User = require("../models/user")

module.exports.signUpForm = (req, res) => {

      res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
      // console.log("post")
      try {
            let { username, email, password } = req.body;

            let newUser = new User({ username, email })
            let registeredUser = await User.register(newUser, password)
            // console.log(registeredUser)
            req.login(registeredUser, (err) => {//passport method
                  if (err) {
                        return next(err)
                  } else {
                        req.flash("success", "User registered successfully")
                        res.redirect("/listings")
                  }
            })

      } catch (e) {
            req.flash("error", e.message);
            // console.log("err")
            res.redirect("/signup")
      }


}
module.exports.loginForm =  (req, res) => {
      res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
      req.flash("success", "Successfully logged in")
      // console.log(req.body)
      let redirectURL = res.locals.redirectURL || "/listings"
      res.redirect(redirectURL)
}

module.exports.logOut = (req, res, next) => {
      req.logout((err) => {
            if (err) {
                  return next(err)
            }
            res.redirect("/listings")
      })
}