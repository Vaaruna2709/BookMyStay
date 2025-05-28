

const Listing = require("../models/listing")
const Review = require("../models/review")
module.exports.createReview = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        const newReview = new Review(req.body.review);
       
        newReview.author = req.user._id;
        //  console.log("review ",newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log("Review added successfully");
        return res.redirect(`/listings/${req.params.id}`);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}
module.exports.deleteReview = async (req, res) => {
        try {
            let { id, reviewId } = req.params;
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
            res.redirect(`/listings/${id}`);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
}