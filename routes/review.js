const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema}= require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const reviewControllers = require("../controllers/review.js")
const {isLoggedIn,isAuthor,validateReview} = require("../middleware.js")


//Create

router.post("/",isLoggedIn, validateReview,wrapAsync(reviewControllers.createReview));


//Delete
 router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewControllers.deleteReview));
    
module.exports = router;