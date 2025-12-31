const mongoose = require("mongoose");
const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new listing created successfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "listing deleted successfully");
  res.redirect("/listings");
};
