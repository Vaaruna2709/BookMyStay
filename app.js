const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const path = require("path");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");
const {reviewSchema}= require("./schema.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("root is working");
})



main()
.then((res)=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}



//Index route
app.get("/listings",async (req,res)=>{
   let allListings = await Listing.find();
   res.render("listings/index",{allListings});
})
//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new")
})
// Create Route
app.post("/listings",wrapAsync( async (req, res) => {
       
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
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
    
        console.error(error);
        res.status(500).send("Error rendering edit page");
   
}));

// Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
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
app.get("/listings/:id",wrapAsync( async (req, res) => {
    
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
       
        res.render("listings/show", { listing }); // Corrected rendering path
    
}));
//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


//Review Route
//Create

app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        const newReview = new Review(req.body.review);
        console.log(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log("Review added successfully");
        return res.redirect(`/listings/${req.params.id}`);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}));
//Delete
 app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
        try {
            let { id, reviewId } = req.params;
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
            res.redirect(`/listings/${id}`);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
}));
    



app.all("*",async(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})
app.use(async(err,req,res,next)=>{
    let {statusCode =500,message="Something went wrong!"} =err;
   res.render("listings/error",{message});
})
app.listen(8080,()=>{
    console.log("listening to port 8080");
})