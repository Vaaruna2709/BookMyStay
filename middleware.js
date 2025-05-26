
const Listing = require("./models/listing.js")

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.path," ", req.originalUrl)
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","Please login to access the listing!")
       return  res.redirect("/login")
    }
    next();

}
module.exports.saveRedirectURL =(req,res,next)=>{
    res.locals.redirectURL = req.session.redirectUrl; //whenever a user tries to access a listing ->isLoggedIn middleware is triggered->
    // then if user is not logged in already we store the path where the user wanted to access(like edit route,create etc) in isLoggedIn middleware
    // -> then passport is called -> passport generally resets the req.session so the url we stored will be deleted ->
    // in order to address the issue we use this middleware ,before calling passport we save it in res.locals
    next()
}

module.exports.isOwner = async (req,res,next)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
          req.flash("error","You don't have permission to modify the listing")
          return res.redirect(`listings/${id}`)
    }
    next()
}

