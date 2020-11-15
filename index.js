//ENV
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
// REQUIREMENTS
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users")
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const MongoDBStore = require("connect-mongo")(session)
// const dbUrl = "mongodb://localhost:27017/camp-review"
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/camp-review"
const secret = process.env.SECRET || "badsecret"
//SETTING EJS AS VIEW ENGINE & SETTING THE PATH TO /VIEWS
app.set("view engine", "ejs" );
app.set("views", path.join(__dirname, "/views"));
//CONNECTING MONGOOSE
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
//MAKING SURE THE CONNECTION IS ESTABLISHED: CONSOLE LOG WHEN STARTING SERVER
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected!")
});
//MIDDLEWARE
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(mongoSanitize())
app.engine("ejs", ejsMate)
//HELMET
app.use(helmet())
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/spiritwalker/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//SESSION CONFIG & MIDDLEWARE
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 //1 day
});
store.on("error", function(e){
    console.log("STORE ERROR", e)
})
const sessionConfig = {
    store: store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7, // 1 week
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
    }
}
app.use(session(sessionConfig))
//SESSION NEEDS TO BE BEFORE PASSPORT
app.use(passport.initialize());
app.use(passport.session());
//HERE WERE TELLING PASSPORT TO USE CERTAIN STRATEGIES THAT ARE INCLUDED IN THE PLUGIN AT THE USER MODEL
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//SETTING UP FLASH
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})
//SERVE PUBLIC DIRECTORY
app.use(express.static(path.join(__dirname, "public")))
//ROUTES MIDDLEWARE
app.use("/", userRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)
app.use("/campgrounds", campgroundRoutes)
//INDEX PAGE
app.get("/", (req,res)=>{
    res.render("index")
});
//HANDLER FOR WHEN AN UNRECOGNIZED URL IS ENTERED
app.all("*", (req,res, next)=>{
    next(new ExpressError("Page not Found", 404))
})
//ERROR HANDLING MIDDLEWARE (HAS TO BE LAST app.use!)
app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Oh no, Something went wrong."
    console.log(err);
    res.status(statusCode).render("error", {err})
})
//RUNNING THE SERVER ON PORT 3K
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`LISTENING ON PORT ${port}`)
});