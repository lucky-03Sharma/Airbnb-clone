const mongoose = require("mongoose");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    } ,
    description:String,
    
    image:{
      filename:String,
      url: {
        type: String,
        default:"https://www.apnacollege.in/path-player?courseid=sigma-6&unit=67d8321fa6cbc3c7ea010866Unit",
        set:(v)=>
             v=== ""
        ?"https://www.apnacollege.in/path-player?courseid=sigma-6&unit=67d8321fa6cbc3c7ea010866Unit"
        :v,
    },
    },
    price: Number,
    location: String,
    country: String,
     owner: {
      type: Schema.Types.ObjectId,
      ref : "User" ,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;