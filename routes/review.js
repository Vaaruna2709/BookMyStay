const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema}= require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validatReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg)
    }else{
        next();
    }
}

//Create

router.post("/", validatReview,wrapAsync(async (req, res) => {
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
 router.delete("/:reviewId",validatReview, wrapAsync(async (req, res) => {
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
    
module.exports = router;