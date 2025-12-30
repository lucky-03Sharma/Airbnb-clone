const express=require("express");
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewJoiSchema }= require("../schema.js");
const Review= require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isReviewAuthor, validateListing } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



const validateReview = (req,res, next)=>{
    let{error} = reviewJoiSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400, error );
     } else {
        next();
     }
};


  //post review route
  router.post("/",
    isLoggedIn, validateReview , wrapAsync(reviewController.createReview));


  //delete review route
router.delete("/:reviewId",
  isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewID } = req.params;
  let review = await Review.findById(reviewID);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You did not create this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
   module.exports = router;