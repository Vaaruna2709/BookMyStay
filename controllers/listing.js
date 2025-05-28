
const Listing = require("../models/listing")


module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index", { allListings });
}

module.exports.new = (req, res) => {

     res.render("listings/new")
}

module.exports.createNewForm = async (req, res) => {
        
        //  let result = listingSchema.validate(req.body);//Joi validation
       
        //  if(result.error){
        //    throw new ExpressError(404,result.error);
        //  }

      
         let listing = req.body.listing;
        //  console.log("req",req.body);
         const newListing = new Listing(listing); // Create new instance
         newListing.owner = req.user._id;
         await newListing.save(); // Save the new listing to the database
         req.flash('success','New Listing created!');
         res.redirect("/listings"); // Redirect to the index page
    
 }
module.exports.editForm =async (req, res) => {
     try{
         
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
     }catch(error){
       
        console.error("err",error);
        res.status(500).send("Error rendering edit page");
     }
    
    
 }
module.exports.update = async (req, res) => {
    try{
     if(!req.body.listing){
         throw new ExpressError(400,"Enter valid Data")
     }
         let { id } = req.params;
        //  console.log("req",req.body);
         await Listing.findByIdAndUpdate(id, { ...req.body.listing });
         res.redirect("/listings");
    }catch(error){
         console.error(error);
         res.status(500).send("Error updating listing");
    }
}

module.exports.show =  async (req, res) => {
     
         let { id } = req.params;
        const listing = await Listing.findById(id).populate({path:"reviews",populate:{
            path:"author",
        }}).populate("owner");
        // console.log(listing.owner.username)
         res.render("listings/show", { listing }); 
     
 }

 module.exports.delete = async (req,res)=>{
     let { id } = req.params;
     const listing = await Listing.findById(id);
     console.log(listing);
     await Listing.findByIdAndDelete(id);
    //  req.flash('deleteListing','Listing deleted successfully!');
     res.redirect("/listings");
 }