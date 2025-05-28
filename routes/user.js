const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const userControllers = require("../controllers/user.js")


router.get("/signup",userControllers.signUpForm)


router.post("/signup", wrapAsync(userControllers.signup))


router.get("/login",userControllers.loginForm)

router.post("/login",saveRedirectURL, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userControllers.login )

router.get("/logout",userControllers.logOut )
module.exports = router;