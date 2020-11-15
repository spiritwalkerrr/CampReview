//REQUIREMENTS
const Campground = require("../models/campground")
const Review = require("../models/review")
//REVIEW POST REQUEST
module.exports.newReview = async (req,res)=> {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Your review has been saved!")
    res.redirect(`/campgrounds/${campground.id}`)
}
//DELETING A REVIEWS
module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) //$pull pulls everything out of that array that matches the critieria
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "The review has been deleted.")
    res.redirect(`/campgrounds/${id}`)
}