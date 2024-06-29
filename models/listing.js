const mongoose = require("mongoose");
const Review =require("./review.js");

const listingSchema = new mongoose.Schema({
    title:{
        type :String,
        required : true
    },
    
    description: String,
    image :{
        type:String,
        set: (v)=>
        v===" " ?
    "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    : v,
     default : "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    price : Number,
    location: String,
    country : String,
    reviews :
    [{
        type:  mongoose.Types.ObjectId,
        ref : "Review"
    }]
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews}})
})

let Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;