const express = require('express');
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema,reviewSchema}= require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
}

//Index route
 router.get("/",async (req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index",{allListings});
 })
 //New Route
 router.get("/new",validateListing,(req,res)=>{
     res.render("listings/new")
 })
 // Create Route
 router.post("/",validateListing,wrapAsync( async (req, res) => {
        
         // let result = listingSchema.validate(req.body);//Joi validation
         // console.log(result);
         // if(result.error){
         //   throw new ExpressError(404,result.error);
         // }
         let listing = req.body.listing;
         console.log(listing);
         const newListing = new Listing(listing); // Create new instance
         await newListing.save(); // Save the new listing to the database
         res.redirect("/listings"); // Redirect to the index page
    
        
     }
 ));
 
 // Edit Route
 router.get("/:id/edit",validateListing, wrapAsync(async (req, res) => {
     
         let { id } = req.params;
         const listing = await Listing.findById(id);
         res.render("listings/edit", { listing });
     
         console.error(error);
         res.status(500).send("Error rendering edit page");
    
 }));
 
 // Update Route
 router.put("/:id",validateListing, wrapAsync(async (req, res) => {
     if(!req.body.listing){
         throw new ExpressError(400,"Enter valid Data")
     }
         let { id } = req.params;
         await Listing.findByIdAndUpdate(id, { ...req.body.listing });
         res.redirect("/listings");
     
         console.error(error);
         res.status(500).send("Error updating listing");
    
 }));
 
 // Show Route
 router.get("/:id",validateListing,wrapAsync( async (req, res) => {
     
         let { id } = req.params;
         const listing = await Listing.findById(id).populate("reviews");
        
         res.render("listings/show", { listing }); // Corrected rendering path
     
 }));
 //Delete Route
 router.delete("/:id",validateListing,wrapAsync(async (req,res)=>{
     let { id } = req.params;
     const listing = await Listing.findById(id);
     console.log(listing);
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
 }))
 module.exports= router;