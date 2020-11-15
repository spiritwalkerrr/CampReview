//REQUIREMENTS
const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync")
const {isLoggedIn, validateReview, isReviewAuthor} = require("./middleware");
const reviews = require("../controllers/reviews")
//REVIEW POST REQUEST
router.post("/", isLoggedIn, validateReview,catchAsync (reviews.newReview));
//DELETE A CAMPGROUND REVIEW
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));
module.exports = router