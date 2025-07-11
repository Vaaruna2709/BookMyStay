require("dotenv").config();

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const path = require("path");

const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require('connect-flash')
const passport =  require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const sessionOptions = {
    secret:process.env.SESSION,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*100,//cookie expires after a week
        maxAge:7*24*60*60*100,
        httpOnly:true,
    },
}

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
  await  mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
     res.locals.currUser = req.user;
    //  console.log("currUser",res.locals.currUser)
    // res.locals.deleteListing = req.flash('deleteListing');
    // if(res.locals.success){
    //     console.log('done');
    // }
  
    // console.log(req.flash('deleteListing'));
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



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