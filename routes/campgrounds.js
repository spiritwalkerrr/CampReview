//REQUIREMENTS
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const {isLoggedIn, validateCampground, isAuthor} = require("./middleware");
const campgrounds = require("../controllers/campgrounds")
const multer = require("multer")
const {storage} = require("../cloudinary/index")
const upload = multer({storage})
//NEW CAMPGROUND PAGE
router.get("/new", isLoggedIn, campgrounds.renderNewForm)
//EDIT A EXISTING CAMPGROUND
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
//SHOW SINGLE CAMPGROUND; EDIT POST REQUEST AND DELETE REQUEST
router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
//CAMPGROUNDS OVERVIEW AND POST REQUEST FOR NEW CAMPGROUND
router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,  upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground))
module.exports= router;