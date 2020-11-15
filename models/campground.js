///REQUIREMENTS
const { array, string } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;
const opts = {toJSON: {virtuals: true}};
//IMAGESCHEMA
const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200")
})
//MAKING THE SCHEMA
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a href="/campgrounds/${this._id}" style="padding-right:10px">${this.title}</a>`
});
//MIDDLEWARE TO REMOVE THE ASSOCIATED REVIEWS WHEN DELETING THE CAMPGROUND
CampgroundSchema.post("findOneAndDelete", async function (doc){
    if (doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

//EXPORTING THE MODEL
module.exports = mongoose.model("Campground", CampgroundSchema)

// https://res.cloudinary.com/spiritwalker/image/upload/c_scale,h_150,w_200/sample.jpg