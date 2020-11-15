//REQUIREMENTS
const User = require("../models/user");
//REGISTER FORM
module.exports.renderRegister = (req, res)=>{
    res.render("users/register")
}
//REGISTER POST
module.exports.register = async(req,res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err =>{ //NEEDED TO LOG YOU IN IMMEDIATELY AFTER REGISTERING
        if(err){ 
            return next(err);
        }
        req.flash("success", `Welcome to CampReview, ${user.username}!`);
        res.redirect("/campgrounds")
    });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register")
    }
}
//LOGIN FORM
module.exports.renderLogin = async(req,res)=>{
    res.render("users/login");
}
//LOGIN POST REQUEST
module.exports.loginUser = async(req,res)=>{
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
//LOGOUT PAGE
module.exports.logoutUser = (req,res)=>{
    req.logout();
    req.flash("success", "You've been logged out.")
    res.redirect("/campgrounds")
}