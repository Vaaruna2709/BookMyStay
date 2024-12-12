const express = require('express');
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema,reviewSchema}= require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req,res,next)=>{
    // Remove _method field from validation
    const { _method, ...bodyWithoutMethod } = req.body;
    let {error} = listingSchema.validate(bodyWithoutMethod);
    console.log(req.body);
    console.log(error)
    if (error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Index route
 router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index",{allListings});
 }))
 //New Route
 router.get("/new",(req,res)=>{
     res.render("listings/new")
 })
 // Create Route
 router.post("/",validateListing,wrapAsync( async (req, res) => {
        
        //  let result = listingSchema.validate(req.body);//Joi validation
       
        //  if(result.error){
        //    throw new ExpressError(404,result.error);
        //  }
         let listing = req.body.listing;
        //  console.log("req",req.body);
         const newListing = new Listing(listing); // Create new instance
         await newListing.save(); // Save the new listing to the database
         req.flash('success','New Listing created!');
         res.redirect("/listings"); // Redirect to the index page
    
        
     }
 ));
 
 // Edit Route
 router.get("/:id/edit", wrapAsync(async (req, res) => {
     try{
         
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
     }catch(error){
       
        console.error("err",error);
        res.status(500).send("Error rendering edit page");
     }
    
    
 }));
 
 // Update Route
 router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    try{
     if(!req.body.listing){
         throw new ExpressError(400,"Enter valid Data")
     }
         let { id } = req.params;
         console.log("req",req.body);
         await Listing.findByIdAndUpdate(id, { ...req.body.listing });
         res.redirect("/listings");
    }catch(error){
         console.error(error);
         res.status(500).send("Error updating listing");
    }
 }));
 
 // Show Route
 router.get("/:id",wrapAsync( async (req, res) => {
     
         let { id } = req.params;
         const listing = await Listing.findById(id).populate("reviews");
        
         res.render("listings/show", { listing }); // Corrected rendering path
     
 }));
 //Delete Route
 router.delete("/:id",wrapAsync(async (req,res)=>{
     let { id } = req.params;
     const listing = await Listing.findById(id);
     console.log(listing);
     await Listing.findByIdAndDelete(id);
    //  req.flash('deleteListing','Listing deleted successfully!');
     res.redirect("/listings");
 }))
 module.exports= router;