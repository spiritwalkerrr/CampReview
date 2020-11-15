//REQUIREMENTS
const mongoose = require("mongoose")
const Campground = require("../models/campground")
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers")
const dbUrl = process.env.DB_URL
//CONNECTING MONGOOSE
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
//MAKING SURE THE CONNECTION IS ESTABLISHED: CONSOLE LOG WHEN STARTING SERVER
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected!")
});
//SCRIPT TO SEED THE CAMPGROUNDS: 1. DELETES THE OLD CAMPS 2. CREATES 50 NEW RANDOM CAMPS BASED OFF THE cities.js FILE 3. CREATES A TITLE BASED OFF THE seedHelpers.js FILE
const seedDB = async ()=>{
    await Campground.deleteMany({});
    for (let i = 0; i <150; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            author: "5fa81f8d2f0e5a18809ac3be",           
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            title : `${descriptors[Math.floor(Math.random()*(descriptors.length))]} ${places[Math.floor(Math.random()*(places.length))]}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/spiritwalker/image/upload/v1605197732/CampReview/fgzfy9twyexujvpn5jgd.jpg',
                  filename: 'CampReview/fgzfy9twyexujvpn5jgd'
                },
                {
                  url: 'https://res.cloudinary.com/spiritwalker/image/upload/v1605197733/CampReview/spgebxkhdjb0n0rxhwtt.jpg',
                  filename: 'CampReview/spgebxkhdjb0n0rxhwtt'
                }
              ],
            description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ",
            price: (Math.floor(Math.random()*50)+20)
        })
        await camp.save()   
    }
}
//EXECUTES THE FUNCTION ABOVE AND CLOSES CONNECTION
seedDB().then(()=>{
    mongoose.connection.close
})
