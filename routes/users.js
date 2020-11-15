//REQUIREMENTS
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const users = require("../controllers/users")
//REGISTER ROUTE & POST
router.route("/register")
    .get((users.renderRegister))
    .post(catchAsync(users.register))
//LOGIN FORM & LOGIN POST
router.route("/login")
     .get(users.renderLogin)
     .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.loginUser);
//LOGOUT LOGIC
router.get("/logout", (users.logoutUser))
//EXPORT
module.exports = router;
