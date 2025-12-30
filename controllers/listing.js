const mongoose = require("mongoose");
const Listing = require("../models/listing");
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new");
};

module.exports.showListing = async (req , res)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  const listing = await Listing.findById(id)
  .populate({path:"reviews",
    populate:{path:"author",
    },
}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req,res,next)=>{
        const newListing= new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","new listing created successfully");
        res.redirect("/listings");  
    };

    module.exports.renderEditForm = async (req,res)=>{
       let {id} = req.params;
        const listing = await Listing.findById(id); 
        if (!listing) {
        req.flash("error", "Listing you requested doesn't exist");
        return res.redirect("/listings");}
    
        res.render("listings/edit.ejs",{listing});
        };

        module.exports.updateListings =  async (req,res)=>{
                let { id } = req.params;
                let listing = await Listing.findById(id);
        
                if (!listing.owner || !listing.owner.equals(req.user._id)) {
                    req.flash("error", "You don't have permission to edit");
                    return res.redirect(`/listings/${id}`);
                }
        
                await Listing.findByIdAndUpdate(id, { ...req.body.listing });
                return res.redirect(`/listings/${id}`);
            };

          module.exports.deleteListing = async(req,res)=> {
                let{id}=req.params;
                let deletedListing= await Listing.findByIdAndDelete(id);
                console.log(deletedListing);
                req.flash("success","listing deleted successfully");
                res.redirect("/listings");
              };
    