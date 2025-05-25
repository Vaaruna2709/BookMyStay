const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")
router.get("/signup", (req, res) => {

      res.render("users/signup.ejs")
})
router.post("/signup", wrapAsync(async (req, res) => {
      // console.log("post")
      try {
            let { username, email, password } = req.body;

            let newUser = new User({ username, email })
            let registeredUser = await User.register(newUser, password)
            // console.log(registeredUser)
            req.login(registeredUser, (err) => {
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


}))
router.get("/login", (req, res) => {
      res.render("users/login.ejs")
})
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
      req.flash("success", "Successfully logged in")
      // console.log(req.body)
      res.redirect("/listings")
})

router.get("/logout", (req, res, next) => {
      req.logout((err) => {
            if (err) {
                  return next(err)
            }
            res.redirect("/listings")
      })
})
module.exports = router;