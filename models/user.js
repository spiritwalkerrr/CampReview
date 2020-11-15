//REQUIREMENTS
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
//ACTUAL SCHEMA - THE PLUGIN ENSURES FOR EXAMPLE THAT THERE IS USERNAME AND ITS UNIQUE
const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(passportLocalMongoose) //ADDS USERNAME AND PASSWORD WHICH ISNT IN THE SCHEMA
//EXPORT
module.exports = mongoose.model("User", UserSchema)