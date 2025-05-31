if(process.env.NODE_ENV != "production"){
require('dotenv').config();

}
const express = require('express');
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
// const {listingSchema,reviewSchema}= require("../schema.js");
// const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
// const { eventNames } = require('../models/review.js');
const upload = multer({ storage })

//Index route
 router.get("/",wrapAsync(listingController.index))

 //New Route
 router.get("/new",isLoggedIn,listingController.new)

 // Create Route
 router.post("/",
 isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync( listingController.createNewForm

 ));
 
 // Edit Route
 router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editForm));
 
 // Update Route
 router.put("/:id",isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.update));
 
 // Show Route
 router.get("/:id",wrapAsync(listingController.show));

 //Delete Route
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete))

 module.exports= router;