const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const path = require("path");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");



const listing = require("./routes/listing.js")
const review = require("./routes/review.js")

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


app.use("/listings",listing);
app.use("/listing/:id/review",review);



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