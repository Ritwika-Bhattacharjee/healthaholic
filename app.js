//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const nodemailer = require('nodemailer');
const tf = require("@tensorflow/tfjs");


var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  service: 'gmail',
  auth: {
    user: 'riya19262619@gmail.com',
    pass: process.env.PASSWORD,
  }
});

/* if you find any issues like invalid username and password not accepted, search this issue in stackoverflow and use the
solutions like:
allow less secure apps to access your account 
and disable two step verification for your account*/

/*diet items variables*/
var meal;
var type;
var food = [
//for diabetes and hepatitis and heart
{
  id:1,
  name:"scrambled paneer and spinach",
  veg:1,
  type:"b",
},
{
  id:1,
  name:"Rava Idli",
  veg:1,
  type:"b",
},
{
  id:1,
  name:"Rava Dhokla or Spinach Dhokla",
  veg:1,
  type:"b",
},
{
  id:1,
  name:"Bajra Garlic Parantha",
  veg:1,
  type:"b",
},
{
  id:1,
  name:"Scrambled Eggs",
  veg:2,
  type:"b",
},
{
  id:1,
  name:"Chicken Stuffed Omlette",
  veg:0,
  type:"b",
},
{
  id:1,
  name:"Chicken Salad",
  veg:0,
  type:"b",
},
{
  id:1,
  name:"Spinach, Avacado and Chicken Sandwich with multi grained Bed",
  veg:0,
  type:"b",
},
{
  id:1,
  name:"Spinach and Bean Quesadillas",
  veg:1,
  type:"l",
},
{
  id:1,
  name:"Mushroom and Brown Rice hash",
  veg:1,
  type:"l",
},
{
  id:1,
  name:"Pesto Bean Brown Rice hash",
  veg:1,
  type:"l",
},
{
  id:1,
  name:"Slow cooked peppers stuffed with beans",
  veg:1,
  type:"l",
},
{
  id:1,
  name:"Mushroom and brown rice hash with poached eggs",
  veg:2,
  type:"l",
},
{
  id:1,
  name:"Cumin-Crusted Fish Fillet with Lemon",
  veg:0,
  type:"l",
},
{
  id:1,
  name:"Fish Tacos with Avocado Salsa and Brown Rice",
  veg:0,
  type:"l",
},
{
  id:1,
  name:"Broiled Rainbow Trout with Lemon Oil and Oven-Grilled Vegetables",
  veg:0,
  type:"l",
},
{
  id:1,
  name:"Unsweetened yogurt with berries",
  veg:1,
  type:"s",
},
{
  id:1,
  name:"Roasted Chickpeas",
  veg:1,
  type:"s",
},
{
  id:1,
  name:"Popcorn",
  veg:1,
  type:"s",
},
{
  id:1,
  name:"Black Bean Salad",
  veg:1,
  type:"s",
},
{
  id:1,
  name:"Egg muffins",
  veg:2,
  type:"s",
},
{
  id:1,
  name:"Hard Boiled Eggs",
  veg:2,
  type:"s",
},
{
  id:1,
  name:"Egg caramel pudding(sugar free)",
  veg:2,
  type:"s",
},
{
  id:1,
  name:"Chapathi and low fat paneer",
  veg:1,
  type:"d",
},
{
  id:1,
  name:"Besan Chilla with salad",
  veg:1,
  type:"d",
},
{
  id:1,
  name:"Whole wheat pasta with vegetables and salad",
  veg:1,
  type:"d",
},
{
  id:1,
  name:"Mushroom and spinach stew",
  veg:1,
  type:"d",
},
{
  id:1,
  name:"Chapathi, mixed vegetables and a bowl of fish",
  veg:0,
  type:"d",
},
{
  id:1,
  name:"Cocunut Chicken Soup",
  veg:0,
  type:"d",
},
{
  id:1,
  name:"Chicken Breast Stuffed with spinach, sprouts and beans",
  veg:0,
  type:"d",
},
{
  id:1,
  name:"Lemon Chicken piccata",
  veg:0,
  type:"d",
},
//for liver disease
{
  id:3,
  name:"Yogurt Custard and strawberry smoothie",
  veg:1,
  type:"b",
},
{
  id:3,
  name:"Steel cut oats with flax and fruits",
  veg:1,
  type:"b",
},
{
  id:3,
  name:"Moroccon carrot salad with ultra green smoothie",
  veg:1,
  type:"b",
},
{
  id:3,
  name:"Soba noodles with mushrooms",
  veg:1,
  type:"b",
},
{
  id:3,
  name:"Crab Salad",
  veg:0,
  type:"b",
},
{
  id:3,
  name:"Chinese egg scallion mushroom omlette",
  veg:2,
  type:"b",
},
{
  id:3,
  name:"1 slice whole wheat toast with margarine and jam and eggs",
  veg:2,
  type:"b",
},
{
  id:3,
  name:"Indian chickpea saute",
  veg:1,
  type:"l",
},
{
  id:3,
  name:"Herb and Mushroom rice casserole",
  veg:1,
  type:"l",
},
{
  id:3,
  name:"Vegan Cauliflower wings",
  veg:1,
  type:"l",
},
{
  id:3,
  name:"Maple Roasted sweet potatoes",
  veg:1,
  type:"l",
},
{
  id:3,
  name:"Perfectly Roasted Turkey",
  veg:0,
  type:"l",
},
{
  id:3,
  name:"Sesame Pork Tacos",
  veg:0,
  type:"l",
},
{
  id:3,
  name:"Turkey and Viggie Stuffed Peppers",
  veg:0,
  type:"l",
},
{
  id:3,
  name:"Chili Lime Grilled Corn",
  veg:1,
  type:"s",
},
{
  id:3,
  name:"Healthy black bean brownies with coffee",
  veg:1,
  type:"s",
},
{
  id:3,
  name:"Pecan Pie Cookies with coffee",
  veg:1,
  type:"s",
},
{
  id:3,
  name:"Cauliflower fritters",
  veg:1,
  type:"s",
},
{
  id:3,
  name:"Springtime salad with chicken and berries",
  veg:0,
  type:"s",
},
{
  id:3,
  name:"Turkey Pie",
  veg:0,
  type:"s",
},
{
  id:3,
  name:"Roasted sweet potato with honey",
  veg:0,
  type:"s",
},
{
  id:3,
  name:"Garlic cilantro lime rice",
  veg:1,
  type:"d",
},
{
  id:3,
  name:"Roasted Sprouts with squash soup",
  veg:1,
  type:"d",
},
{
  id:3,
  name:"Tuscan White Bean Stew",
  veg:1,
  type:"d",
},
{
  id:3,
  name:"Turmeric Rice",
  veg:1,
  type:"d",
},
{
  id:3,
  name:"Whole wheat spaghetti with lemon, salmon and basil",
  veg:0,
  type:"d",
},
{
  id:3,
  name:"Springtime salad with chicken and berries",
  veg:0,
  type:"d",
},
{
  id:3,
  name:"Egg baskets",
  veg:2,
  type:"d",
},
{
  id:3,
  name:"Fish Tacos with chipotle sauce",
  veg:0,
  type:"d",
},

//for kidney disease
{
  id:5,
  name:"Herbed Omlette",
  veg:2,
  type:"b",
},
{
  id:5,
  name:"Pancakes",
  veg:1,
  type:"b",
},
{
  id:5,
  name:"Blueberry muffins",
  veg:1,
  type:"b",
},


{
  id:5,
  name:"Tuna Noodles",
  veg:0,
  type:"b",
},
{
  id:5,
  name:"French Toast",
  veg:0,
  type:"b",
},
{
  id:5,
  name:"Italian Turkey Sausage",
  veg:0,
  type:"b",
},


{
  id:5,
  name:"Herb Rice casserole",
  veg:1,
  type:"l",
},
{
  id:5,
  name:"Vegetables and Rice",
  veg:1,
  type:"l",
},
{
  id:5,
  name:"Yellow Squash and Green Onions",
  veg:1,
  type:"l",
},
{
  id:5,
  name:"Cabbage Saute Rice",
  veg:1,
  type:"l",
},

{
  id:5,
  name:"Devilled Eggs and Cabbage Soup",
  veg:2,
  type:"l",
},
{
  id:5,
  name:"Egg Salad with Rice",
  veg:2,
  type:"l",
},
{
  id:5,
  name:"Crispy Oven Fried Chicken with egg whites",
  veg:0,
  type:"l",
},
{
  id:5,
  name:"Jalapeno Pepper Chicken",
  veg:0,
  type:"l",
},

{
  id:5,
  name:"Corn Pudding",
  veg:1,
  type:"s",
},
{
  id:5,
  name:"Blueberry baked bread",
  veg:1,
  type:"s",
},
{
  id:5,
  name:"Fried Onion Rings",
  veg:1,
  type:"s",
},
{
  id:5,
  name:"Pineapple Pudding",
  veg:1,
  type:"s",
},

{
  id:5,
  name:"Turkish Meatballs",
  veg:0,
  type:"s",
},
{
  id:5,
  name:"Turkey lime Tacos",
  veg:0,
  type:"s",
},
{
  id:5,
  name:"Chicken nuggets with egg whites",
  veg:0,
  type:"s",
},
{
  id:5,
  name:"Baked Egg Custard",
  veg:2,
  type:"s",
},

{
  id:5,
  name:"Itallion Stuffed green peppers",
  veg:1,
  type:"d",
},
{
  id:5,
  name:"Pizza with tomato, cauliflower and green peppers",
  veg:1,
  type:"d",
},
{
  id:5,
  name:"Cauliflower Rice Saute",
  veg:1,
  type:"d",
},
{
  id:5,
  name:"Eggplant Casserole",
  veg:1,
  type:"d",
},

{
  id:5,
  name:"Lemon Chicken",
  veg:0,
  type:"d",
},
{
  id:5,
  name:"Fish Tacos",
  veg:0,
  type:"d",
},
{
  id:5,
  name:"Baked Fish with rice",
  veg:0,
  type:"d",
},
{
  id:5,
  name:"Turkey Noodles",
  veg:0,
  type:"d",
},

//for arthritis 
{
  id:7,
  name:"Cherry coconut porridge",
  veg:1,
  type:"b",
},
{
  id:7,
  name:"Raspberry smoothie and spinach salad",
  veg:1,
  type:"b",
},
{
  id:7,
  name:"Mediterranean tuna salad",
  veg:1,
  type:"b",
},
{
  id:7,
  name:"Gingerbread oatmeal",
  veg:1,
  type:"b",
},
{
  id:7,
  name:"Rhubarb, apple, and ginger muffins",
  veg:0,
  type:"b",
},
{
  id:7,
  name:"Buckwheat and ginger granola",
  veg:0,
  type:"b",
},
{
  id:7,
  name:"Gluten-free banana or strawberry crepes",
  veg:0,
  type:"b",
},
{
  id:7,
  name:"omelet that includes fresh vegetables, such as spinach and peppers",
  veg:2,
  type:"b",
},
{
  id:7,
  name:"Thai pumpkin soup",
  veg:1,
  type:"l",
},
{
  id:7,
  name:"Red lentil and squash curry stew",
  veg:1,
  type:"l",
},
{
  id:7,
  name:"Cannellini Beans with Garlic and Sage",
  veg:1,
  type:"l",
},
{
  id:7,
  name:"Rice with carrot, tomato and lentil Soup",
  veg:1,
  type:"l",
},
{
  id:7,
  name:"Kale Caesar salad with grilled chicken wrap",
  veg:0,
  type:"l",
},
{
  id:7,
  name:"Lemon herb salmon and zucchini",
  veg:0,
  type:"l",
},
{
  id:7,
  name:"Smoked salmon potato tartine",
  veg:0,
  type:"l",
},
{
  id:7,
  name:"Turmeric Chicken and Quinoa",
  veg:0,
  type:"l",
},
{
  id:7,
  name:"Winter fruit salad with agave-pomegranate vinaigrette",
  veg:1,
  type:"s",
},
{
  id:7,
  name:"Cocunut and Sweet Potato Muffins",
  veg:1,
  type:"s",
},
{
  id:7,
  name:"Cherry Mango Smoothie",
  veg:1,
  type:"s",
},
{
  id:7,
  name:"Green Papaya Salad",
  veg:1,
  type:"s",
},
{
  id:7,
  name:"Lemon Basil Baked Garlic Butter Salmon",
  veg:0,
  type:"s",
},
{
  id:7,
  name:"mix for nuts with ginger tea",
  veg:0,
  type:"s",
},
{
  id:7,
  name:"Italian-style stuffed red peppers",
  veg:1,
  type:"d",
},
{
  id:7,
  name:"Roasted red pepper and sweet potato soup",
  veg:1,
  type:"d",
},
{
  id:7,
  name:"Baby spinach and mushroom frittata",
  veg:1,
  type:"d",
},
{
  id:7,
  name:"Sweet potato black bean burgers",
  veg:1,
  type:"d",
},
{
  id:7,
  name:"Turkey and quinoa stuffed bell peppers",
  veg:0,
  type:"d",
},
{
  id:7,
  name:"Baked tilapia with pecan rosemary topping",
  veg:0,
  type:"d",
},
{
  id:7,
  name:"Slow cooker turkey chili",
  veg:0,
  type:"d",
},
{
  id:7,
  name:"Curried potatoes with poached eggs",
  veg:2,
  type:"d",
},
//for migraine
{
  id:9,
  name:"Buckwheat Pancakes",
  veg:1,
  type:"b",
},
{
  id:9,
  name:"Strawberry cream muffin",
  veg:1,
  type:"b",
},
{
  id:9,
  name:"Ginger peach muffins",
  veg:1,
  type:"b",
},
{
  id:9,
  name:"Gluten free apple cider Donut",
  veg:1,
  type:"b",
},
{
  id:9,
  name:"Crab cakes",
  veg:0,
  type:"b",
},
{
  id:9,
  name:"Pumpkin Cheesecake",
  veg:0,
  type:"b",
},
{
  id:9,
  name:"Kale Cauliflower salad with curry dressing",
  veg:1,
  type:"l",
},
{
  id:9,
  name:"Peach and Watermelon goat cheese salad",
  veg:1,
  type:"l",
},
{
  id:9,
  name:"Mediterrenean Pasta Salad",
  veg:1,
  type:"l",
},
{
  id:9,
  name:"Roasted Red Pepper plus veggie wrap",
  veg:1,
  type:"l",
},
{
  id:9,
  name:"Honey Garlic Chicken",
  veg:0,
  type:"l",
},
{
  id:9,
  name:"Tomato Spinach Chicken Spaghetti",
  veg:0,
  type:"l",
},
{
  id:9,
  name:"Salmon with creamy spinach",
  veg:0,
  type:"l",
},
{
  id:9,
  name:"Chilli garlic shrimp",
  veg:0,
  type:"l",
},
{
  id:9,
  name:"Pumpkin cornbread muffins",
  veg:1,
  type:"s",
},
{
  id:9,
  name:"French Toast",
  veg:1,
  type:"s",
},
{
  id:9,
  name:"Spiced Apple Honey Cake",
  veg:1,
  type:"s",
},
{
  id:9,
  name:"Peppermint Cookies",
  veg:1,
  type:"s",
},
{
  id:9,
  name:"Chicken Nuggets",
  veg:0,
  type:"s",
},
{
  id:9,
  name:"Chicken Tinga Tacos",
  veg:0,
  type:"s",
},
{
  id:9,
  name:"Tuna Radish bites",
  veg:0,
  type:"s",
},
{
  id:9,
  name:"Chicken Wings",
  veg:0,
  type:"s",
},
{
  id:9,
  name:"Lemongrass ginger Soup",
  veg:1,
  type:"d",
},
{
  id:9,
  name:"Ginger Spaghetti",
  veg:1,
  type:"d",
},
{
  id:9,
  name:"Sweet Potato and Coconut curry soup",
  veg:1,
  type:"d",
},
{
  id:9,
  name:"Chilli Zucchini Soup",
  veg:1,
  type:"d",
},
{
  id:9,
  name:"Clams in herbed butter broth",
  veg:0,
  type:"d",
},
{
  id:9,
  name:"Brown rice with chicken soup",
  veg:0,
  type:"d",
},
{
  id:9,
  name:"Herbed Pork with Apple amd roasted vegetables",
  veg:0,
  type:"d",
},
{
  id:9,
  name:"Roasted Pork",
  veg:0,
  type:"d",
},
];

/*declaring global variables/constants*/
var x1="";
var x2="";
var x3="";
var x4="";
var x5="";
var x6="";
var x7="";
var x8="";

var symptoms=[];
var diseases=[];
var diabetesSymptoms = ['s1','s2','s3','s4','s5','s6','s7','s8','s9'];
var hepatitisSymptoms = ['s10', 's11', 's12', 's13'];
var jaundiceSymptoms = ['s12', 's13', 's9', 's5', 's36', 's10', 's14', 's11', 's2'];
var liverSymptoms = ['s12', 's10', 's36', 's15', 's9', 's13', 's16', 's17'];
var heartSymptoms = ['s18', 's19', 's20', 's21', 's23', 's22', 's24','s15'];
var kidneySymptoms = ['s25', 's26', 's9', 's3', 's27', 's28', 's15', 's29', 's10'];
var choleraSymptoms =  ['s30', 's31', 's14', 's23', 's32', 's33', 's34', 's1', 's29', 's35', 's36', 's37', 's38', 's11', 's14'];
var arthritisSymptoms = ['s39', 's40', 's41', 's42', 's11', 's5', 's15'];
var tuberculosisSymptoms = ['s43', 's44', 's45', 's11', 's2', 's5', 's10'];
var migraineSymptoms = ['s46', 's47', 's48', 's49', 's50', 's51', 's52', 's53', 's54', 's55', 's56', 's10', 's4'];

var method=""; //this could be google, facebook or normal
var identity=""; //googleid, fbid or username depending on method of login/register
var bodytype="";
var pass1=[]; var pass2=[]; var pass3=[]; var pass4=[];

function findCommonElements(array1, array2){
  var count=0;
  for(var i=0; i<array1.length; i++){
    for(var j=0; j<array2.length; j++){
      if(array1[i]===array2[j]){
        count = count+1;
      }
    }
  }
  return count;
}


/*importing dataset*/

var displayname="";

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/healthuserDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  username: String,
  password: String,
  firstname: String,
  googleId: String,
  facebookId: String,
  Age: String,
  Gender: String,
  Bloodgroup: String,
  Nationality: String,
  Mobno: String,
  Email: String,
  Address: String,
  rbcc: [String],
  wbcc: [String],
  hemo: [String],
  platelet: [String],
  lymph: [String],
  sugar: [String],
  chol: [String],
  urea: [String],
  calcium: [String],
  Diseases: [String],
  bodytype: String,
  breakfast: [String],
  lunch: [String],
  snacks: [String],
  dinner: [String],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets/",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    displayname = profile.name.givenName;
    identity = profile.id;
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//facebook login:
passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
    //callbackURL: "https://www.urbanladder.com/locations/furniture-in-bhubaneshwar"
    
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    displayname = profile.displayName;
    identity = profile.id;
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/", function(req, res){
  res.render("landingpage");
});

/*facebook login*/
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    method = "facebook";
    console.log(method);
    console.log(identity);
    res.redirect('/homepage');
  });


app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to home.
    method = "google";
    console.log(method);
    console.log(identity);
    res.redirect("/homepage");
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/homepage", function(req, res){
  if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      console.log(founduser.sugar);
      res.render("homepage2", {displayname: displayname, sugar: founduser.sugar, hemo: founduser.hemo, platelet: founduser.platelet, chol: founduser.chol, rbcc: founduser.rbcc, wbcc: founduser.wbcc, urea: founduser.urea});
    });
  }
  else if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      console.log(founduser.sugar);
      res.render("homepage2", {displayname: displayname, sugar: founduser.sugar, hemo: founduser.hemo, platelet: founduser.platelet, chol: founduser.chol, rbcc: founduser.rbcc, wbcc: founduser.wbcc, urea: founduser.urea});
    });
  }
 else if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      console.log(founduser.sugar);
      res.render("homepage2", {displayname: displayname, sugar: founduser.sugar, hemo: founduser.hemo, platelet: founduser.platelet, chol: founduser.chol, rbcc: founduser.rbcc, wbcc: founduser.wbcc, urea: founduser.urea});
    });
  }


});

/*app.get("/submit", function(req, res){
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});*/

/*app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);

  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/homepage");
        });
      }
    }
  });
});*/

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username, firstname: req.body.firstname}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        displayname = req.body.firstname;
        method = "normal";
        identity = req.body.username;
        console.log(method);
        console.log(identity);
        res.redirect("/homepage");
      });
    }
  });

});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        User.findOne({username: req.body.username}, function(err,user){
          if(err){
            console.log(err);
          }else{
            displayname = user.firstname;
          }
        });
        method = "normal";
        identity = req.body.username;
        console.log(method);
        console.log(identity);
        res.redirect("/homepage");
      });
    }
  });

});

app.get("/diseasepage", function(req, res){
  res.render("diseasepage");
});

app.get("/testpage", function(req, res){
  res.render("testpage");
});

app.post("/whichdisease", function(req, res){
  console.log(req.body.symptoms);
  symptoms=req.body.symptoms;
  
var x=0;
diseases=[];
  x=findCommonElements(symptoms, diabetesSymptoms);
  if(x>=5){
    diseases.push("diabetes");
  }
  x=findCommonElements(symptoms, hepatitisSymptoms);
  if(x>=3){
    diseases.push("hepatitis");
  }
  x=findCommonElements(symptoms, liverSymptoms);
  if(x>=4){
    diseases.push("liver disease");
  }
  x=findCommonElements(symptoms, heartSymptoms);
  if(x>=4){
    diseases.push("heart disease");
  }
  x=findCommonElements(symptoms, kidneySymptoms);
  if(x>=5){
    diseases.push("kidney disease");
  }
  x=findCommonElements(symptoms, choleraSymptoms);
  if(x>=8){
    diseases.push("cholera");
  }
  x=findCommonElements(symptoms, arthritisSymptoms);
  if(x>=4){
    diseases.push("arthritis");
  }
  x=findCommonElements(symptoms, tuberculosisSymptoms);
  if(x>=4){
    diseases.push("tuberculosis");
  }
  x=findCommonElements(symptoms, jaundiceSymptoms);
  if(x>=5){
    diseases.push("jaundice");
  }
  x=findCommonElements(symptoms, migraineSymptoms);
  if(x>=7){
    diseases.push("migraine");
  }

  console.log(diseases);

  /*logging the disease into database before passing*/
  if(method=="normal"){
    User.findOneAndUpdate({username: identity}, {Diseases: diseases}, function(err){
      if(!err){
        console.log("updated disease list");
      }
    });
  }else if(method=="google"){
    User.findOneAndUpdate({googleId: identity}, {Diseases: diseases}, function(err){
      if(!err){
        console.log("updated disease list");
      }
    });
  }else if(method=="facebook"){
    User.findOneAndUpdate({googleId: identity}, {Diseases: diseases}, function(err){
      if(!err){
        console.log("updated disease list");
      }
    });
  }



  res.render("diseaseresult", {diseases: diseases});

});

app.get("/profilepage", function(req, res){
  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("profilepage", {age: founduser.Age, gender: founduser.Gender, bg: founduser.Bloodgroup, nation: founduser.Nationality, mob: founduser.Mobno, email: founduser.Email, addr: founduser.Address, name: founduser.firstname});

    });
  }
  if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      res.render("profilepage", {age: founduser.Age, gender: founduser.Gender, bg: founduser.Bloodgroup, nation: founduser.Nationality, mob: founduser.Mobno, email: founduser.Email, addr: founduser.Address, name: founduser.firstname});

    });
  }
  if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      if (!founduser) {console.log("not found!");}
      else{
              res.render("profilepage", {age: founduser.Age, gender: founduser.Gender, bg: founduser.Bloodgroup, nation: founduser.Nationality, mob: founduser.Mobno, email: founduser.Email, addr: founduser.Address, name: founduser.firstname});

      }

    });
  }
});

app.get("/healthstatspage", function(req, res){

  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("healthstatspage", {name: founduser.firstname, rbcc: founduser.rbcc[founduser.rbcc.length-1], wbcc: founduser.wbcc[founduser.wbcc.length-1], hemo: founduser.hemo[founduser.hemo.length-1], platelet: founduser.platelet[founduser.platelet.length-1], lymph: founduser.lymph[founduser.lymph.length-1], sugar: founduser.sugar[founduser.sugar.length-1], chol: founduser.chol[founduser.chol.length-1], urea: founduser.urea[founduser.urea.length-1], cal: founduser.calcium[founduser.calcium.length-1]});

    });
  }
  if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      res.render("healthstatspage", {name: founduser.firstname, rbcc: founduser.rbcc[founduser.rbcc.length-1], wbcc: founduser.wbcc[founduser.wbcc.length-1], hemo: founduser.hemo[founduser.hemo.length-1], platelet: founduser.platelet[founduser.platelet.length-1], lymph: founduser.lymph[founduser.lymph.length-1], sugar: founduser.sugar[founduser.sugar.length-1], chol: founduser.chol[founduser.chol.length-1], urea: founduser.urea[founduser.urea.length-1], cal: founduser.calcium[founduser.calcium.length-1]});

    });
  }
  if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      if (!founduser) {console.log("not found!");}
      else{
      res.render("healthstatspage", {name: founduser.firstname, rbcc: founduser.rbcc[founduser.rbcc.length-1], wbcc: founduser.wbcc[founduser.wbcc.length-1], hemo: founduser.hemo[founduser.hemo.length-1], platelet: founduser.platelet[founduser.platelet.length-1], lymph: founduser.lymph[founduser.lymph.length-1], sugar: founduser.sugar[founduser.sugar.length-1], chol: founduser.chol[founduser.chol.length-1], urea: founduser.urea[founduser.urea.length-1], cal: founduser.calcium[founduser.calcium.length-1]});

      }

    });
  }

});

app.get("/profiledietpage", function(req, res){

  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("profiledietpage", {name: founduser.firstname, breakfast: founduser.breakfast, lunch: founduser.lunch, snacks: founduser.snacks, dinner: founduser.dinner});
    });
  }else if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      res.render("profiledietpage", {name: founduser.firstname, breakfast: founduser.breakfast, lunch: founduser.lunch, snacks: founduser.snacks, dinner: founduser.dinner});
    });
  }if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      res.render("profiledietpage", {name: founduser.firstname, breakfast: founduser.breakfast, lunch: founduser.lunch, snacks: founduser.snacks, dinner: founduser.dinner});
    });
  }

});

app.get("/profilefitnesspage", function(req, res){

  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("profilefitnesspage", {name: founduser.firstname, bodytype: founduser.bodytype});
    });
  }else if(method=="facebook"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("profilefitnesspage", {name: founduser.firstname, bodytype: founduser.bodytype});
    });
  }else if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      res.render("profilefitnesspage", {name: founduser.firstname, bodytype: founduser.bodytype});
    });
  }  
});


app.get("/editpp", function(req, res){

  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("editpp", {age: founduser.Age, gender: founduser.Gender, bg: founduser.Bloodgroup, nation: founduser.Nationality, mob: founduser.Mobno, email: founduser.Email, addr: founduser.Address, name: founduser.firstname});

    });
  }else if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      res.render("editpp", {age: founduser.Age, gender: founduser.Gender, bg: founduser.Bloodgroup, nation: founduser.Nationality, mob: founduser.Mobno, email: founduser.Email, addr: founduser.Address, name: founduser.firstname});

    });
  }else if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      res.render("editpp", {age: founduser.Age, gender: founduser.Gender, bg: founduser.Bloodgroup, nation: founduser.Nationality, mob: founduser.Mobno, email: founduser.Email, addr: founduser.Address, name: founduser.firstname});

    });
  }

});
app.get("/ediths", function(req, res){
  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      res.render("ediths", {name: founduser.firstname, rbcc: founduser.rbcc[founduser.rbcc.length-1], wbcc: founduser.wbcc[founduser.wbcc.length-1], hemo: founduser.hemo[founduser.hemo.length-1], platelet: founduser.platelet[founduser.platelet.length-1], lymph: founduser.lymph[founduser.lymph.length-1], sugar: founduser.sugar[founduser.sugar.length-1], chol: founduser.chol[founduser.chol.length-1], urea: founduser.urea[founduser.urea.length-1], cal: founduser.calcium[founduser.calcium.length-1]});

    });
  }
  if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      res.render("ediths", {name: founduser.firstname, rbcc: founduser.rbcc[founduser.rbcc.length-1], wbcc: founduser.wbcc[founduser.wbcc.length-1], hemo: founduser.hemo[founduser.hemo.length-1], platelet: founduser.platelet[founduser.platelet.length-1], lymph: founduser.lymph[founduser.lymph.length-1], sugar: founduser.sugar[founduser.sugar.length-1], chol: founduser.chol[founduser.chol.length-1], urea: founduser.urea[founduser.urea.length-1], cal: founduser.calcium[founduser.calcium.length-1]});

    });
  }
  if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      if (!founduser) {console.log("not found!");}
      else{
      res.render("ediths", {name: founduser.firstname, rbcc: founduser.rbcc[founduser.rbcc.length-1], wbcc: founduser.wbcc[founduser.wbcc.length-1], hemo: founduser.hemo[founduser.hemo.length-1], platelet: founduser.platelet[founduser.platelet.length-1], lymph: founduser.lymph[founduser.lymph.length-1], sugar: founduser.sugar[founduser.sugar.length-1], chol: founduser.chol[founduser.chol.length-1], urea: founduser.urea[founduser.urea.length-1], cal: founduser.calcium[founduser.calcium.length-1]});

      }

    });
  }
});

app.post("/edit1", function(req,res){
  x1 = req.body.age; 
  x2 = req.body.gender;
  x3 = req.body.bg;
  x4 = req.body.nation;
  x5 = req.body.mob;
  x6 = req.body.email;
  x7 = req.body.addr;
  x8 = req.body.name;
  if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      if(!founduser){
        console.log("not found!");
      }
      if(x1.length==0){
        x1 = founduser.Age;
      }
      if(x2.length==0){
        x2 = founduser.Gender;
      }
      if(x3.length==0){
        x3 =founduser.Bloodgroup;
      }
      if(x4.length==0){
        x4 = founduser.Nationality;
      }
      if(x5.length==0){
        x5 = founduser.Mobno;
      }
      if(x6.length==0){
        x6 = founduser.Email;
      }
      if(x7.length==0){
        x7 = founduser.Address;
      }
      if(x8.length==0){
        x8 = founduser.firstname;
      }

    User.findOneAndUpdate({facebookId: identity}, {firstname: x8, Age: x1, Gender: x2, Bloodgroup: x3, Nationality: x4, Mobno: x5, Email: x6, Address: x7}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Updated!");
      }
    });
    });
  }

  if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      if(!founduser){
        console.log("not found!");
      }
      if(x1.length==0){
        x1 = founduser.Age;
      }
      if(x2.length==0){
        x2 = founduser.Gender;
      }
      if(x3.length==0){
        x3 =founduser.Bloodgroup;
      }
      if(x4.length==0){
        x4 = founduser.Nationality;
      }
      if(x5.length==0){
        x5 = founduser.Mobno;
      }
      if(x6.length==0){
        x6 = founduser.Email;
      }
      if(x7.length==0){
        x7 = founduser.Address;
      }
      if(x8.length==0){
        x8 = founduser.firstname;
      }

    User.findOneAndUpdate({googleId: identity}, {firstname: x8, Age: x1, Gender: x2, Bloodgroup: x3, Nationality: x4, Mobno: x5, Email: x6, Address: x7}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Updated!");
      }
    });
    });
  }

  if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      if(!founduser){
        console.log("not found!");
      }
      if(x1.length==0){
        x1 = founduser.Age;
      }
      if(x2.length==0){
        x2 = founduser.Gender;
      }
      if(x3.length==0){
        x3 =founduser.Bloodgroup;
      }
      if(x4.length==0){
        x4 = founduser.Nationality;
      }
      if(x5.length==0){
        x5 = founduser.Mobno;
      }
      if(x6.length==0){
        x6 = founduser.Email;
      }
      if(x7.length==0){
        x7 = founduser.Address;
      }
      if(x8.length==0){
        x8 = founduser.firstname;
      }

    User.findOneAndUpdate({username: identity}, {firstname: x8, Age: x1, Gender: x2, Bloodgroup: x3, Nationality: x4, Mobno: x5, Email: x6, Address: x7}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Updated!");
      }
    });
    });
  }

res.redirect("/profilepage");
});



/*edit2 for health status edit*/
app.post("/edit2", function(req, res){
  var x1 = req.body.rbcc; 
  var x2 = req.body.wbcc;
  var x3 = req.body.hemo;
  var x4 = req.body.plat;
  var x5 = req.body.lymph;
  var x6 = req.body.sugar;
  var x7 = req.body.chol;
  var x8 = req.body.urea;
  var x9 = req.body.cal;
  var a1;
  var a2;
  var a3;
  var a4;
  var a5;
  var a6;
  var a7;
  var a8;
  var a9;
  if(method=="facebook"){
    User.findOne({facebookId: identity}, function(err, founduser){
      if(!founduser){
        console.log("not found!");
      }
      if(x1.length!=0){
        founduser.rbcc.push(x1);
      }
      if(x2.length!=0){
        founduser.wbcc.push(x2);
      }
      if(x3.length!=0){
        founduser.hemo.push(x3);
      }
      if(x4.length!=0){
        founduser.platelet.push(x4);
      }
      if(x5.length!=0){
        founduser.lymph.push(x5);
      }
      if(x6.length!=0){
        founduser.sugar.push(x6);
      }
      if(x7.length!=0){
        founduser.chol.push(x7);
      }
      if(x8.length!=0){
        founduser.urea.push(x8);
      }
      if(x9.length!=0){
        console.log(founduser.calcium);
        founduser.calcium.push(x9);

      }

    User.findOneAndUpdate({facebookId: identity}, {rbcc: founduser.rbcc, wbcc: founduser.wbcc, hemo: founduser.hemo, platelet: founduser.platelet, lymph: founduser.lymph, sugar: founduser.sugar, chol: founduser.chol, urea: founduser.urea, calcium: founduser.calcium}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Updated!");
      }
    });
    });
  }
    if(method=="google"){
    User.findOne({googleId: identity}, function(err, founduser){
      if(!founduser){
        console.log("not found!");
      }
      if(x1.length!=0){
        founduser.rbcc.push(x1);
      }
      if(x2.length!=0){
        founduser.wbcc.push(x2);
      }
      if(x3.length!=0){
        founduser.hemo.push(x3);
      }
      if(x4.length!=0){
        founduser.platelet.push(x4);
      }
      if(x5.length!=0){
        founduser.lymph.push(x5);
      }
      if(x6.length!=0){
        founduser.sugar.push(x6);
      }
      if(x7.length!=0){
        founduser.chol.push(x7);
      }
      if(x8.length!=0){
        founduser.urea.push(x8);
      }
      if(x9.length!=0){
        console.log(founduser.calcium);
        founduser.calcium.push(x9);

      }

    User.findOneAndUpdate({googleId: identity}, {rbcc: founduser.rbcc, wbcc: founduser.wbcc, hemo: founduser.hemo, platelet: founduser.platelet, lymph: founduser.lymph, sugar: founduser.sugar, chol: founduser.chol, urea: founduser.urea, calcium: founduser.calcium}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Updated!");
      }
    });
    });
  }

  if(method=="normal"){
    User.findOne({username: identity}, function(err, founduser){
      if(!founduser){
        console.log("not found!");
      }
      if(x1.length!=0){
        founduser.rbcc.push(x1);
      }
      if(x2.length!=0){
        founduser.wbcc.push(x2);
      }
      if(x3.length!=0){
        founduser.hemo.push(x3);
      }
      if(x4.length!=0){
        founduser.platelet.push(x4);
      }
      if(x5.length!=0){
        founduser.lymph.push(x5);
      }
      if(x6.length!=0){
        founduser.sugar.push(x6);
      }
      if(x7.length!=0){
        founduser.chol.push(x7);
      }
      if(x8.length!=0){
        founduser.urea.push(x8);
      }
      if(x9.length!=0){
        console.log(founduser.calcium);
        founduser.calcium.push(x9);

      }

    User.findOneAndUpdate({username: identity}, {rbcc: founduser.rbcc, wbcc: founduser.wbcc, hemo: founduser.hemo, platelet: founduser.platelet, lymph: founduser.lymph, sugar: founduser.sugar, chol: founduser.chol, urea: founduser.urea, calcium: founduser.calcium}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Updated!");
      }
    });
    });
  }

res.redirect("/healthstatspage");
});

app.get("/fitnessquiz", function(req, res){
  res.render("fitnessquiz");
});


app.post("/quiz", function(req, res){
  var ans = [req.body.q1, req.body.q2, req.body.q3, req.body.q4, req.body.q5, req.body.q6, req.body.q7, req.body.q8, req.body.q9, req.body.q10]
  var c1=0;
  var c2=0;
  var c3=0;
  var temp = "";
  for(var i=0; i<ans.length; i++){
    if(ans[i]==="a"){
      c1= c1+1;
    }else if(ans[i]==="b"){
      c2 = c2+1;
    }else if(ans[i]==="c"){
      c3=c3+1;
    }
  }
  if(c1>=c2 && c1>=c3){
    bodytype="ectomorph";
    temp = "ecto";
    
  }else if(c2>=c3 && c2>=c1){
    bodytype="mesomorph";
    temp = "meso";
    
  }else if(c3>=c1 && c3>=c2){
    bodytype="endomorph";
    temp = "endo";
    
  }

  /*logging the bodytype into database before passing*/
  if(method=="normal"){
    User.findOneAndUpdate({username: identity}, {bodytype: bodytype}, function(err){
      if(!err){
        console.log("updated bodytype");
      }
    });
  }else if(method=="google"){
    User.findOneAndUpdate({googleId: identity}, {bodytype: bodytype}, function(err){
      if(!err){
        console.log("updated bodytype");
      }
    });
  }else if(method=="facebook"){
    User.findOneAndUpdate({googleId: identity}, {bodytype: bodytype}, function(err){
      if(!err){
        console.log("updated bodytype");
      }
    });
  }

  console.log(bodytype);
  res.render(temp);
});

app.get("/dietquiz", function(req, res){
  res.render("dietquiz");
});

function checkid(x, arr){
  for(var i=0; i<arr.length; i++){
    if(x==arr[i]){
      return 1;
    }
  }
  return 0;
}

function checkveg(veg, type){
  var typeint = parseInt(type);
  var vegint = parseInt(veg);
  if(typeint===0 && vegint ===0){
    return 1;
  }
  if(typeint===1 && vegint ===1){
    return 1;
  }
  
  if(typeint===2){
    if(vegint===1||vegint===2){
      return 1;
    }
  }
  if(typeint===3){
    return 1;
  }
  return 0;
}

function findrandom2(arr){
  var n1 = Math.floor((Math.random() * (arr.length-1)) + 1);
  var n2=0;
  while(1){
    n2 = Math.floor((Math.random() * (arr.length-1)) + 1);
    if(n2!=n1){
      break;
    }
  }
  var temparr = [];
  temparr.push(arr[n1]);
  temparr.push(arr[n2]);
  return temparr;
}

function findrandom(arr){
  var n1 = Math.floor((Math.random() * (arr.length-1)) + 1);
  var temparr = [];
  temparr.push(arr[n1]);
  return temparr;
}

app.post("/getdiet", function(req, res){
  meal = req.body.meal;
  type = req.body.type;
  console.log(meal);
  console.log(type);
  res.redirect("/yourdiet");

});

var breakfast=[];
var lunch=[];
var snacks = [];
var dinner = [];

app.get("/yourdiet", function(req, res){

  var res1;
  var res2; 
  var res3;
  var reqdid=[];

  breakfast = [];
  lunch=[];
  snacks=[];
  dinner=[];

  /*finding reqid*/

  for(var i=0; i<diseases.length; i++){
    if(diseases[i]=="diabetes"|| diseases[i]=="hepatitis"|| diseases[i]=="heart disease"){
      reqdid.push(1);
    }
    else if(diseases[i]=="liver disease"){
      reqdid.push(3);
    }
    else if(diseases[i]=="kidney disease"){
      reqdid.push(5);
    }
    else if(diseases[i]=="arthritis"){
      reqdid.push(7);
    }
    else if(diseases[i]=="migraine"){
      reqdid.push(9);
    }
  }

  if(reqdid.length==0){
    reqdid=[1,2,3,5,7,9];
  }

  for(var i=0; i<food.length; i++){
    res1 = checkid(food[i].id, reqdid);
    res2 = checkveg(food[i].veg, type);
    if(res1 && res2){
      if(food[i].type=="b"){
        breakfast.push(food[i].name);
      }else if(food[i].type=="l"){
        lunch.push(food[i].name);
      }else if(food[i].type=="s"){
        snacks.push(food[i].name);
      }else if(food[i].type=="d"){
        dinner.push(food[i].name);
      }
    }
  }
  pass1=[]; pass2=[]; pass3=[]; pass4=[];
  for(var i=0; i<meal.length; i++){
    if(meal[i]=="b"){
      pass1=findrandom(breakfast);
    }
    if(meal[i]=="l"){
      pass2=findrandom2(lunch);
    }
    if(meal[i]=="s"){
      pass3=findrandom(snacks);
    }
    if(meal[i]=="d"){
      pass4=findrandom2(dinner);
    }
  }
  console.log(pass1);
  console.log(pass2);
  console.log(pass3);
  console.log(pass4);

  /*entering the diets into database before passing*/
  if(method=="google"){
    User.findOneAndUpdate({googleId: identity},{breakfast: pass1, lunch: pass2, snacks: pass3, dinner: pass4}, function(err){
      if(!err){
        console.log("Meals Updated Successfully");
      }
    });
  }else if(method=="facebook"){
    User.findOneAndUpdate({facebookId: identity},{breakfast: pass1, lunch: pass2, snacks: pass3, dinner: pass4}, function(err){
      if(!err){
        console.log("Meals Updated Successfully");
      }
    });
  }else if(method=="normal"){
    User.findOneAndUpdate({username: identity},{breakfast: pass1, lunch: pass2, snacks: pass3, dinner: pass4}, function(err){
      if(!err){
        console.log("Meals Updated Successfully");
      }
    });
  }

  res.render("yourdiet", {breakfast: pass1, lunch: pass2, snacks: pass3, dinner: pass4});
});

/*app.get("/contact", function(req, res){

  var mailOptions = {
  from: 'riya19262619@gmail.com',
  to: 'ritspure@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

});*/

app.get("/contact", function(req, res){
  res.render("contact");
});

app.post("/contactform", function(req, res){
   var mailOptions = {
  from: 'riya19262619@gmail.com',
  to: 'ritspure@gmail.com',
  subject: 'Sending Email regarding Healthaholic User issues',
  text: req.body.message +"\nName: "+ req.body.name + "\nEmail: "+ req.body.email
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

res.redirect("/");
});

app.post("/contactform2", function(req, res){
   var mailOptions = {
  from: 'riya19262619@gmail.com',
  to: 'ritspure@gmail.com',
  subject: 'Sending Email regarding Healthaholic User issues',
  text: req.body.message +"\nName: "+ req.body.name + "\nEmail: "+ req.body.email
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

res.redirect("/contact");
});

/*deep learning part*/

var result;
var resultpercent;
var minimumf;
var maximumf;
var minimuml;
var maximuml;
var model;

/*defining a model*/

function createModelforliver(){
  model = tf.sequential();
  //layer one of ann
  model.add(tf.layers.dense({
    units: 2,
    useBias: true,
    activation: 'relu', // use 'linear' for linear regression
    inputDim: 10,  // no of features in the input matrix
  }));

  //layer two of ann
  model.add(tf.layers.dense({
    units: 2,
    useBias: true,
    activation: 'relu', // use 'linear' for linear regression
  }));

  //layer three of ann
  model.add(tf.layers.dense({
    units: 2,
    useBias: true,
    activation: 'relu', // use 'linear' for linear regression
  }));
  //layer four of ann
  model.add(tf.layers.dense({
    units: 2,
    useBias: true,
    activation: 'relu', // use 'linear' for linear regression
  }));

  //layer output of ann
  model.add(tf.layers.dense({
    units: 1, //since we have only one output label or variable
    useBias: true,
    activation: 'relu', // use 'linear' for linear regression
  }));

  const optimizer = tf.train.sgd(0.01); //by passing the learning rate

  model.compile({
    loss: 'binaryCrossentropy',
    //loss: 'meanSquaredError',
    optimizer,
  });

  return model;
}

function createModelforkidney(){
  model = tf.sequential();
  //layer one of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
    inputDim: 8,  // no of features in the input matrix
  }));

  //layer two of ann
  model.add(tf.layers.dense({
    units: 15,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer three of ann
  model.add(tf.layers.dense({
    units: 10,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));
  //layer four of ann
  model.add(tf.layers.dense({
    units: 5,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer output of ann
  model.add(tf.layers.dense({
    units: 1, //since we have only one output label or variable
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  const optimizer = tf.train.sgd(0.01); //by passing the learning rate

  model.compile({
    
    //loss: 'binaryCrossentropy',

    loss: 'meanSquaredError',
    optimizer,
  });

  return model;
}

function createModelforheart(){
  model = tf.sequential();
  //layer one of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
    inputDim: 9,  // no of features in the input matrix
  }));

  //layer two of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer three of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));
  //layer four of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer output of ann
  model.add(tf.layers.dense({
    units: 1, //since we have only one output label or variable
    useBias: true,
    activation: 'sigmoid', // use 'linear' for linear regression
  }));

  const optimizer = tf.train.sgd(0.1); //by passing the learning rate

  model.compile({
    //loss: 'binaryCrossentropy',
    loss: 'meanSquaredError',
    optimizer,
  });

  return model;
}


function createModelfordiabetes(){
  model = tf.sequential();
  //layer one of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
    inputDim: 7,  // no of features in the input matrix
  }));

  //layer two of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer three of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));
  //layer four of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer output of ann
  model.add(tf.layers.dense({
    units: 1, //since we have only one output label or variable
    useBias: true,
    activation: 'sigmoid', // use 'linear' for linear regression
  }));

  const optimizer = tf.train.sgd(0.1); //by passing the learning rate

  model.compile({
    //loss: 'binaryCrossentropy',
    loss: 'meanSquaredError',
    optimizer,
  });

  return model;
}

function createModelforhepatitis(){
  model = tf.sequential();
  //layer one of ann
  model.add(tf.layers.dense({
    units: 20,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
    inputDim: 4,  // no of features in the input matrix
  }));

  //layer two of ann
  model.add(tf.layers.dense({
    units: 15,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer three of ann
  model.add(tf.layers.dense({
    units: 10,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));
  //layer four of ann
  model.add(tf.layers.dense({
    units: 5,
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  //layer output of ann
  model.add(tf.layers.dense({
    units: 1, //since we have only one output label or variable
    useBias: true,
    activation: 'linear', // use 'linear' for linear regression
  }));

  const optimizer = tf.train.sgd(0.1); //by passing the learning rate

  model.compile({
    //loss: 'binaryCrossentropy',
    loss: 'meanSquaredError',
    optimizer,
  });

  return model;
}


/*training model function*/
async function trainModel(model, trainingfeaturetensor, traininglabeltensor){
  return model.fit(trainingfeaturetensor, traininglabeltensor, {
    epochs: 100,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, log) => console.log('Epoch '+epoch+': loss = '+log.loss)
    }
  });
}

/*predict function for new input data*/

async function predictliver(x1,x2,x3,x4,x5,x6,x7,x8,x9,x10){
  const predictionInput1 = parseInt(x1);
  const predictionInput2 = parseInt(x2);
  const predictionInput3 = parseInt(x3);
  const predictionInput4 = parseInt(x4);
  const predictionInput5 = parseInt(x5);
  const predictionInput6 = parseInt(x6);
  const predictionInput7 = parseInt(x7);
  const predictionInput8 = parseInt(x8);
  const predictionInput9 = parseInt(x9);
  const predictionInput10 = parseInt(x10);



  tf.tidy(()=>{
    const inputtensor = tf.tensor2d([[predictionInput1, predictionInput2, predictionInput3, predictionInput4, predictionInput5, predictionInput6, predictionInput7, predictionInput8, predictionInput9, predictionInput10]]);
    const normalisedInput = normalise(inputtensor, minimumf, maximumf);
    const normalisedoutputtensor = model.predict(normalisedInput.tensor);
    const denormalisedoutputtensor = denormalise(normalisedoutputtensor, minimuml, maximuml);
    result = denormalisedoutputtensor.dataSync()[0];
    resultpercent = (result*100).toFixed(1); //fix to one decimal place

  });
}

async function predictkidney(x3,x4,x6,x7,x10,x13,x14,x19){

  //const predictionInput1 = parseInt(x1);
  //const predictionInput2 = parseInt(x2);
  const predictionInput3 = parseInt(x3);
  const predictionInput4 = parseInt(x4);
  const predictionInput6 = parseInt(x6);
  const predictionInput7 = parseInt(x7);
  //const predictionInput8 = parseInt(x8);
  //const predictionInput9 = parseInt(x9);
  const predictionInput10 = parseInt(x10);
  //const predictionInput11 = parseInt(x11);
  //const predictionInput12 = parseInt(x12);
  const predictionInput13 = parseInt(x13);
  const predictionInput14 = parseInt(x14);
  //const predictionInput18 = parseInt(x18);
  const predictionInput19 = parseInt(x19);
  //const predictionInput20 = parseInt(x20);
  //const predictionInput21 = parseInt(x21);
  //const predictionInput22 = parseInt(x22);


  tf.tidy(()=>{
    const inputtensor = tf.tensor2d([[predictionInput3, predictionInput4, predictionInput6, predictionInput7, predictionInput10, predictionInput13, predictionInput14, predictionInput19]]);
    const normalisedInput = normalise(inputtensor, minimumf, maximumf);
    const normalisedoutputtensor = model.predict(normalisedInput.tensor);
    const denormalisedoutputtensor = denormalise(normalisedoutputtensor, minimuml, maximuml);
    result = denormalisedoutputtensor.dataSync()[0];
    resultpercent = (result*100).toFixed(1); //fix to one decimal place

  });
}

async function predictdiabetes(x1,x2,x3,x5,x6,x7,x8){
  const predictionInput1 = parseInt(x1);
  const predictionInput2 = parseInt(x2);
  const predictionInput3 = parseInt(x3);
  const predictionInput5 = parseInt(x5);
  const predictionInput6 = parseInt(x6);
  const predictionInput7 = parseInt(x7);
  const predictionInput8 = parseInt(x8);


  tf.tidy(()=>{
    const inputtensor = tf.tensor2d([[predictionInput1, predictionInput2, predictionInput3, predictionInput5, predictionInput6, predictionInput7, predictionInput8]]);
    const normalisedInput = normalise(inputtensor, minimumf, maximumf);
    const normalisedoutputtensor = model.predict(normalisedInput.tensor);
    const denormalisedoutputtensor = denormalise(normalisedoutputtensor, minimuml, maximuml);
    result = denormalisedoutputtensor.dataSync()[0];
    resultpercent = (result*100).toFixed(1); //fix to one decimal place

  });
}

async function predicthepatitis(x1,x2,x3,x4){
  const predictionInput1 = parseInt(x1);
  const predictionInput2 = parseInt(x2);
  const predictionInput3 = parseInt(x3);
  const predictionInput4 = parseInt(x4);
  

  tf.tidy(()=>{
    const inputtensor = tf.tensor2d([[predictionInput1, predictionInput2, predictionInput3, predictionInput4]]);
    const normalisedInput = normalise(inputtensor, minimumf, maximumf);
    const normalisedoutputtensor = model.predict(normalisedInput.tensor);
    const denormalisedoutputtensor = denormalise(normalisedoutputtensor, minimuml, maximuml);
    result = denormalisedoutputtensor.dataSync()[0];
    resultpercent = (result*100).toFixed(1); //fix to one decimal place

  });
}


async function predictheart(x1,x2,x3,x4,x5,x6,x7,x8,x9){
  const predictionInput1 = parseInt(x1);
  const predictionInput2 = parseInt(x2);
  const predictionInput3 = parseInt(x3);
  const predictionInput4 = parseInt(x4);
  const predictionInput5 = parseInt(x5);
  const predictionInput6 = parseInt(x6);
  const predictionInput7 = parseInt(x7);
  const predictionInput8 = parseInt(x8);
  const predictionInput9 = parseInt(x9);


  tf.tidy(()=>{
    const inputtensor = tf.tensor2d([[predictionInput1, predictionInput2, predictionInput3, predictionInput4, predictionInput5, predictionInput6, predictionInput7, predictionInput8, predictionInput9]]);
    const normalisedInput = normalise(inputtensor, minimumf, maximumf);
    const normalisedoutputtensor = model.predict(normalisedInput.tensor);
    const denormalisedoutputtensor = denormalise(normalisedoutputtensor, minimuml, maximuml);
    result = denormalisedoutputtensor.dataSync()[0];
    resultpercent = (result*100).toFixed(1); //fix to one decimal place

  });
}



/*normalising function*/
function normalise(tensor, previousMin = null, previousMax = null){
  const featuredimensions = tensor.shape.length>1 && tensor.shape[1];
  if(featuredimensions && featuredimensions>1){
    //means more than 1 feature
    //split into separate tensors for each feature along axis=1
    const features = tf.split(tensor, featuredimensions, 1);

    //normalise and find min/max for each feature
    const normalisedfeatures = features.map((featureTensor, i)=>
      normalise(featureTensor,
        previousMin ? previousMin[i]: null,
        previousMax ? previousMax[i]: null,
        )
      );
    //prepare return values
    const returnTensor  = tf.concat(normalisedfeatures.map(f => f.tensor),1); //concatenating along axis=1
    const min = normalisedfeatures.map(f=>f.min); //array of minimuns of all features
    const max = normalisedfeatures.map(f=>f.max); //array of maximums of all features

    return {tensor: returnTensor, min, max}
  }
  else{
    //normalisation code for just one feature
    const min = previousMin||tensor.min();
    const max = previousMax||tensor.max();
    const normalisedtensor = tensor.sub(min).div(max.sub(min));
    return{
      tensor: normalisedtensor,
      min,
      max
    }
  }
}

function denormalise(tensor, min, max){
  const featuredimensions = tensor.shape.length>1 && tensor.shape[1];
  if(featuredimensions && featuredimensions>1){
    //means more than 1 feature
    //split into separate tensors for each feature along axis=1
    const features = tf.split(tensor, featuredimensions, 1);

    const denormalised = features.map((featureTensor, i)=>denormalise(featureTensor, min[i], max[i]));
    const returnTensor = tf.concat(denormalised, 1);
    return returnTensor;
  }else{
    //denormalising for one feature
    const denormalisedtensor = tensor.mul(max.sub(min)).add(min);
    return denormalisedtensor;
  }

  
}

/*importing dataset*/
async function rundiabetes(){
  const diabetesdata = tf.data.csv("file://"+__dirname+"/datasets/diabetes.csv");
  
  /*extracting x and y from dataset*/
  const pointsDataset = diabetesdata.map(record => ({
    x1: record.Pregnancies,
    x2: record.Glucose,
    x3: record.BloodPressure,
    //x4: record.SkinThickness,
    x5: record.Insulin,
    x6: record.BMI,
    x7: record.DiabetesPedigreeFunction,
    x8: record.Age,
    class: record.Outcome,
  }));
  const points = await pointsDataset.toArray();
  //removing one element from the array if it has odd number of elements, otherwise splitting into train and test will give error
  if(points.length %2 !==0){
    points.pop();
  }
  tf.util.shuffle(points);
  //removing zeros and replacing by average
  for(var i=0; i<points.length; i++){
    if(points[i].x5==0){
      points[i].x5=80;
    }
    if(points[i].x6==0){
      points[i].x6=32;
    }
    if(points[i].x3==0){
      points[i].x3=69;
    }
    if(points[i].x2==0){
      points[i].x5=121;
    }
    if(points[i].x7==0){
      points[i].x5=0.47;
    }

  }
  /*extracting features or inputs*/

  const featurevalues = points.map(p => [p.x1, p.x2, p.x3, p.x5, p.x6, p.x7, p.x8]);
  const featureTensor = tf.tensor2d(featurevalues);

  /*extracting label or output*/
  const labelvalues = points.map(p => p.class);
  const labelTensor = tf.tensor2d(labelvalues, [labelvalues.length, 1]);

  //console.log(featureTensor);
  //console.log(labelTensor);

  const normalisedfeature = normalise(featureTensor);
  const normalisedlabel = normalise(labelTensor);
  minimumf = normalisedfeature.min;
  minimuml = normalisedlabel.min;
  maximumf = normalisedfeature.max;
  maximuml = normalisedlabel.max;
  //normalisedfeature.tensor.print();

  //denormalise(normalisedfeature.tensor, normalisedfeature.min, normalisedfeature.max).print();
  /*splitting into train and test sets*/
  const [trainingfeaturetensor, testingfeaturetensor] = tf.split(normalisedfeature.tensor,2);

  const [traininglabeltensor, testinglabeltensor] = tf.split(normalisedlabel.tensor,2);
  //trainingfeaturetensor.print(true);

  model = createModelfordiabetes();
  /*inspecting the model*/
  //model.summary();

  /*training the model*/
  const result = await trainModel(model, trainingfeaturetensor, traininglabeltensor);
  console.log(result); //to see the structure of data returned by the model and heb=nce find the loss
  const trainingLoss = result.history.loss.pop();
  console.log('Training set loss: '+ trainingLoss);
  const validationLoss = result.history.val_loss.pop();
  console.log('Validation set loss: '+ validationLoss);

  /*evaluating testing set loss*/
  const lossTensor = model.evaluate(testingfeaturetensor, testinglabeltensor);
  const loss = await lossTensor.dataSync(); //the loss returned is a scalar tensor and hence we need to sync it
  console.log('Testing set loss:'+ loss);
}


async function runheart(){
  const heartdata = tf.data.csv("file://"+__dirname+"/datasets/heart.csv");
  
  /*extracting x and y from dataset*/
  const pointsDataset = heartdata.map(record => ({
    x1: record.age,
    x2: record.sex,
    x3: record.cp,
    x4: record.trestbps,
    x5: record.chol,
    x6: record.fbs,
    x7: record.restecg,
    x8: record.thalach,
    x9: record.exang,
    class: record.target,
  }));
  const points = await pointsDataset.toArray();
  //removing one element from the array if it has odd number of elements, otherwise splitting into train and test will give error
  if(points.length %2 !==0){
    points.pop();
  }
  tf.util.shuffle(points);
  
  /*extracting features or inputs*/

  const featurevalues = points.map(p => [p.x1, p.x2, p.x3, p.x4, p.x5, p.x6, p.x7, p.x8, p.x9]);
  const featureTensor = tf.tensor2d(featurevalues);

  /*extracting label or output*/
  const labelvalues = points.map(p => p.class);
  const labelTensor = tf.tensor2d(labelvalues, [labelvalues.length, 1]);

  //console.log(featureTensor);
  //console.log(labelTensor);

  const normalisedfeature = normalise(featureTensor);
  const normalisedlabel = normalise(labelTensor);
  minimumf = normalisedfeature.min;
  minimuml = normalisedlabel.min;
  maximumf = normalisedfeature.max;
  maximuml = normalisedlabel.max;

  //denormalise(normalisedfeature.tensor, normalisedfeature.min, normalisedfeature.max).print();
  /*splitting into train and test sets*/
  const [trainingfeaturetensor, testingfeaturetensor] = tf.split(normalisedfeature.tensor,2);

  const [traininglabeltensor, testinglabeltensor] = tf.split(normalisedlabel.tensor,2);
  //trainingfeaturetensor.print(true);

  model = createModelforheart();
  /*inspecting the model*/
  //model.summary();

  /*training the model*/
  const result = await trainModel(model, trainingfeaturetensor, traininglabeltensor);
  console.log(result); //to see the structure of data returned by the model and heb=nce find the loss
  const trainingLoss = result.history.loss.pop();
  console.log('Training set loss: '+ trainingLoss);
  const validationLoss = result.history.val_loss.pop();
  console.log('Validation set loss: '+ validationLoss);

  /*evaluating testing set loss*/
  const lossTensor = model.evaluate(testingfeaturetensor, testinglabeltensor);
  const loss = await lossTensor.dataSync(); //the loss returned is a scalar tensor and hence we need to sync it
  console.log('Testing set loss:'+ loss);
}


async function runkidney(){
  const kidneydata = tf.data.csv("file://"+__dirname+"/datasets/kidney.csv");
  
  /*extracting x and y from dataset*/
  const pointsDataset = kidneydata.map(record => ({
    x1: record.age,
    x2: record.bp,
    x3: record.sg, //specific gravity
    x4: record.al, //normal albumin range is 3.4 to 5.4g/dl
    x5: record.su, //4.0 to 7.8 mmol/l
    x6: record.rc, //4.7 to 6.1 million cells per microlitre is normal
    x7: record.wc, //red blood and white blood cell count
    x8: record.bgr, //blood glucose random in mgs/dl
    x9: record.bu,
    x10: record.sc, //serum creatinine in mgs/dl
    x11: record.sod,
    x12: record.pot, 
    x13: record.hemo,
    x14: record.pcv, //packed cell volume
    x18: record.pc, //0-4 pvf is normal for puss cell
    x19: record.htn, //hypertension
    x20: record.dm, //diabetes mellitus
    x21: record.appet, //appetite good or poor
    x22: record.ane, //anemia
    class: record.classification,
  }));
  const points = await pointsDataset.toArray();
  //removing one element from the array if it has odd number of elements, otherwise splitting into train and test will give error
  if(points.length %2 !==0){
    points.pop();
  }
  tf.util.shuffle(points);
  //converting all data into numerical data
  for(var i=0; i<points.length; i++){
    if(points[i].x1==null){
      points[i].x1=47;
    }
    if(points[i].x2==null){
      points[i].x2=70;
    }
    if(points[i].x3==null){
      points[i].x3=1.02;
    }
    if(points[i].x4==null){
      points[i].x4=0;
    }
    if(points[i].x5==null){
      points[i].x5=0;
    }
    if(points[i].x6==null){
      points[i].x6=5.4;
    }
    if(points[i].x7==null){
      points[i].x7=7542;
    }
    if(points[i].x8==null){
      points[i].x8=106;
    }
    if(points[i].x9==null){
      points[i].x9=33.67;
    }
    if(points[i].x10==null){
      points[i].x10=0.82;
    }
    if(points[i].x11==null){
      points[i].x11=142;
    }
    if(points[i].x12==null){
      points[i].x12=4.2;
    }
    if(points[i].x13==null){
      points[i].x13=15.5;
    }
    if(points[i].x14==null){
      points[i].x14=48.32;
    }

    if(points[i].x18==='normal'){   //for pus cell
      points[i].x18=1;
    }else if(points[i].x18=='abnormal'){
      points[i].x18=0;
    }else{
      points[i].x18=1;
    }

    if(points[i].x19==='yes'){
      points[i].x19=1;
    }
    else{
      points[i].x19=0;
    }

    if(points[i].x20==='yes'){
      points[i].x20=1;
    }
    else{
      points[i].x20=0;
    }

    if(points[i].x22==='yes'){
      points[i].x22=1;
    }
    else{
      points[i].x22=0;
    }

    if(points[i].x21==='poor'){
      points[i].x21=1;
    }
    else{
      points[i].x21=0;
    }

    if(points[i].class==='ckd'){
      points[i].class=1;
    }
    else{
      points[i].class=0;
    }

  }
  /*extracting features or inputs*/
  //const featurevalues = points.map(p => [p.x6]);

  const featurevalues = points.map(p => [p.x3, p.x4, p.x6, p.x7, p.x10, p.x13, p.x14, p.x19]);

  //const featurevalues = points.map(p => [p.x1, p.x2, p.x3, p.x4, p.x5, p.x6, p.x7, p.x8, p.x9, p.x10, p.x11, p.x12, p.x13, p.x14, p.x18, p.x19, p.x20, p.x21, p.x22]);
  const featureTensor = tf.tensor2d(featurevalues);

  /*extracting label or output*/
  const labelvalues = points.map(p => p.class);
  const labelTensor = tf.tensor2d(labelvalues, [labelvalues.length, 1]);

  //console.log(featureTensor);
  //console.log(labelTensor);

  const normalisedfeature = normalise(featureTensor);
  const normalisedlabel = normalise(labelTensor);
  minimumf = normalisedfeature.min;
  minimuml = normalisedlabel.min;
  maximumf = normalisedfeature.max;
  maximuml = normalisedlabel.max;

  //denormalise(normalisedfeature.tensor, normalisedfeature.min, normalisedfeature.max).print();
  /*splitting into train and test sets*/
  const [trainingfeaturetensor, testingfeaturetensor] = tf.split(normalisedfeature.tensor,2);

  const [traininglabeltensor, testinglabeltensor] = tf.split(normalisedlabel.tensor,2);
  //trainingfeaturetensor.print(true);

  model = createModelforkidney();
  /*inspecting the model*/
  //model.summary();

  /*training the model*/
  const result = await trainModel(model, trainingfeaturetensor, traininglabeltensor);
  console.log(result); //to see the structure of data returned by the model and heb=nce find the loss
  const trainingLoss = result.history.loss.pop();
  console.log('Training set loss: '+ trainingLoss);
  const validationLoss = result.history.val_loss.pop();
  console.log('Validation set loss: '+ validationLoss);

  //evaluating testing set loss
  const lossTensor = model.evaluate(testingfeaturetensor, testinglabeltensor);
  const loss = await lossTensor.dataSync(); //the loss returned is a scalar tensor and hence we need to sync it
  console.log('Testing set loss:'+ loss);
}


async function runliver(){
  const liverdata = tf.data.csv("file://"+__dirname+"/datasets/liver.csv");
  
  /*extracting x and y from dataset*/
  const pointsDataset = liverdata.map(record => ({
    x1: record.Age,
    x2: record.Gender,
    x3: record.Total_Bilirubin,
    x4: record.Direct_Bilirubin,
    x5: record.Alkaline_Phosphotase,
    x6: record.Alamine_Aminotransferase,
    x7: record.Aspartate_Aminotransferase,
    x8: record.Total_Protiens,
    x9: record.Albumin,
    x10: record.Albumin_and_Globulin_Ratio,
    class: record.Dataset,
  }));
  const points = await pointsDataset.toArray();
  //removing one element from the array if it has odd number of elements, otherwise splitting into train and test will give error
  if(points.length %2 !==0){
    points.pop();
  }
  tf.util.shuffle(points);
  //removing zeros and replacing by average
  for(var i=0; i<points.length; i++){
    if(points[i].x2==='Male'){
      points[i].x2=1;
    }else{
      points[i].x2=0;
    }
    if(points[i].class==2){
      points[i].class=0;
    }
  }
  /*extracting features or inputs*/

  const featurevalues = points.map(p => [p.x1, p.x2, p.x3, p.x4, p.x5, p.x6, p.x7, p.x8, p.x9, p.x10]);
  const featureTensor = tf.tensor2d(featurevalues);

  /*extracting label or output*/
  const labelvalues = points.map(p => p.class);
  const labelTensor = tf.tensor2d(labelvalues, [labelvalues.length, 1]);

  //console.log(featureTensor);
  //console.log(labelTensor);

  const normalisedfeature = normalise(featureTensor);
  const normalisedlabel = normalise(labelTensor);
  minimumf = normalisedfeature.min;
  minimuml = normalisedlabel.min;
  maximumf = normalisedfeature.max;
  maximuml = normalisedlabel.max;
  //normalisedfeature.tensor.print();

  //denormalise(normalisedfeature.tensor, normalisedfeature.min, normalisedfeature.max).print();
  /*splitting into train and test sets*/
  const [trainingfeaturetensor, testingfeaturetensor] = tf.split(normalisedfeature.tensor,2);

  const [traininglabeltensor, testinglabeltensor] = tf.split(normalisedlabel.tensor,2);
  //trainingfeaturetensor.print(true);

  model = createModelforliver();
  /*inspecting the model*/
  //model.summary();

  /*training the model*/
  const result = await trainModel(model, trainingfeaturetensor, traininglabeltensor);
  console.log(result); //to see the structure of data returned by the model and heb=nce find the loss
  const trainingLoss = result.history.loss.pop();
  console.log('Training set loss: '+ trainingLoss);
  const validationLoss = result.history.val_loss.pop();
  console.log('Validation set loss: '+ validationLoss);

  /*evaluating testing set loss*/
  const lossTensor = model.evaluate(testingfeaturetensor, testinglabeltensor);
  const loss = await lossTensor.dataSync(); //the loss returned is a scalar tensor and hence we need to sync it
  console.log('Testing set loss:'+ loss);
}

async function runhepatitis(){
  const hepatitisdata = tf.data.csv("file://"+__dirname+"/datasets/hepatitis.csv");
  
  /*extracting x and y from dataset*/
  const pointsDataset = hepatitisdata.map(record => ({
    x1: record.age,
    x2: record.sex,
    x3: record.steroids,
    x4: record.antivirals,
    x5: record.fatigue,
    x6: record.malaise,
    x7: record.anorexia,
    x8: record.liverfirm,
    x9: record.liverbig,
    x10: record.bilirubin,
    x11: record.alkphos,
    x12: record.albumin,
    x13: record.protein,
    x14: record.histology,

    class: record.target,
  }));
  const points = await pointsDataset.toArray();
  //removing one element from the array if it has odd number of elements, otherwise splitting into train and test will give error
  if(points.length %2 !==0){
    points.pop();
  }
  tf.util.shuffle(points);
  //removing zeros and replacing by average
  for(var i=0; i<points.length; i++){
    if(points[i].x2==2){
      points[i].x2=0;
    }else{
      points[i].x2=1;
    }
    if(points[i].x3==2){
      points[i].x3=0;
    }else{
      points[i].x3=1;
    }
    if(points[i].x4==2){
      points[i].x4=0;
    }else{
      points[i].x4=1;
    }
    if(points[i].x5==2){
      points[i].x5=0;
    }else{
      points[i].x5=1;
    }
    if(points[i].x6==2){
      points[i].x6=0;
    }else{
      points[i].x6=1;
    }
    if(points[i].x7==2){
      points[i].x7=0;
    }else{
      points[i].x7=1;
    }
    if(points[i].x8==2){
      points[i].x8=0;
    }else{
      points[i].x8=1;
    }
    if(points[i].x9==2){
      points[i].x9=0;
    }else{
      points[i].x9=1;
    }
    if(points[i].x14==2){
      points[i].x14=0;
    }else{
      points[i].x14=1;
    }
    if(points[i].x10==='?'){
      points[i].x10 = 1;
    }
    if(points[i].x11==='?'){
      points[i].x11 = 80;
    }
    if(points[i].x12==='?'){
      points[i].x12 = 4;
    }
    if(points[i].x13==='?'){
      points[i].x13 = 50;
    }
    if(points[i].class==2){
      points[i].class=0;
    }else{
      points[i].class=1;
    }
  }
  console.log(points);
  /*extracting features or inputs*/

  const featurevalues = points.map(p => [p.x10, p.x11, p.x12, p.x13]);
  //const featurevalues = points.map(p => [p.x1, p.x2, p.x3, p.x4, p.x5, p.x6, p.x7, p.x8, p.x9, p.x10, p.x11, p.x12, p.x13, p.x14]);
  const featureTensor = tf.tensor2d(featurevalues);

  /*extracting label or output*/
  const labelvalues = points.map(p => p.class);
  const labelTensor = tf.tensor2d(labelvalues, [labelvalues.length, 1]);

  //console.log(featureTensor);
  //console.log(labelTensor);

  const normalisedfeature = normalise(featureTensor);
  const normalisedlabel = normalise(labelTensor);
  minimumf = normalisedfeature.min;
  minimuml = normalisedlabel.min;
  maximumf = normalisedfeature.max;
  maximuml = normalisedlabel.max;
  //normalisedfeature.tensor.print();

  //denormalise(normalisedfeature.tensor, normalisedfeature.min, normalisedfeature.max).print();
  /*splitting into train and test sets*/
  const [trainingfeaturetensor, testingfeaturetensor] = tf.split(normalisedfeature.tensor,2);

  const [traininglabeltensor, testinglabeltensor] = tf.split(normalisedlabel.tensor,2);
  //trainingfeaturetensor.print(true);

  model = createModelforhepatitis();
  /*inspecting the model*/
  //model.summary();

  /*training the model*/
  const result = await trainModel(model, trainingfeaturetensor, traininglabeltensor);
  console.log(result); //to see the structure of data returned by the model and heb=nce find the loss
  const trainingLoss = result.history.loss.pop();
  console.log('Training set loss: '+ trainingLoss);
  const validationLoss = result.history.val_loss.pop();
  console.log('Validation set loss: '+ validationLoss);

  /*evaluating testing set loss*/
  const lossTensor = model.evaluate(testingfeaturetensor, testinglabeltensor);
  const loss = await lossTensor.dataSync(); //the loss returned is a scalar tensor and hence we need to sync it
  console.log('Testing set loss:'+ loss);
}




/*app.get("/", function(req,res){
  res.render("predict");
});*/

app.get("/hepatitis", function(req,res){
  runhepatitis();
  res.render("hepatitis", {result: ""});
});

app.get("/kidney", function(req,res){
  runkidney();
  runheart();
  res.render("kidney", {result: ""});
});

app.get("/liver", function(req,res){
  runliver();
  runheart();
  res.render("liver", {result: ""});
});


app.get("/diabetes", function(req,res){
  rundiabetes();
  res.render("diabetes", {result: ""});
});

app.get("/heart", function(req,res){
  runheart();
  res.render("heart", {result: ""});
});

app.post("/predictioninputforhepatitis", function(req, res){
  var x1 = req.body.bili;
  var x2 = req.body.alkphos;
  var x3 = req.body.albumin;
  var x4 = req.body.protein;

  if(x1==""){
    x1="1.8";
  }
  if(x2==""){
    x2="93";
  }
  if(x3==""){
    x3="3.5";
  }
  if(x4==""){
    x4="38.35";
  }

  predicthepatitis(x1,x2,x3,x4);
  console.log(result);
  res.render("diabetes", {result: "You have "+Math.floor(resultpercent)+ "% chances of Hepatitis."});
  
});

app.post("/predictioninputfordiabetes", function(req, res){
  var x1 = req.body.preg;
  var x2 = req.body.glucose;
  var x3 = req.body.bp;
  //var x4 = req.body.st;
  var x5 = req.body.insulin;
  var x6 = req.body.bmi;
  var x7 = req.body.dpf;
  var x8 = req.body.age;

  if(x1==""){
    x1 = "3"; 
  }
  if(x2==""){
    x2 = "120";
  }
  if(x3==""){
    x3 = "69";
  }
  if(x5==""){
    x5 = "80";
  }
  if(x6==""){
    x6 = "32";
  }
  if(x7==""){
    x7 = "0.47";
  }
  if(x8==""){
    x8 = "33";
  }

  predictdiabetes(x1,x2,x3,x5,x6,x7,x8);
  console.log(result);
  res.render("diabetes", {result: "You have "+Math.floor(resultpercent)+ "% chances of Diabetes."});
  
});

app.post("/predictioninputforheart", function(req, res){
  var x1 = req.body.age;
  var x2 = req.body.sex;
  var x3 = req.body.cp;
  var x4 = req.body.restbp;
  var x5 = req.body.chol;
  var x6 = req.body.fbs;
  var x7 = req.body.restecg;
  var x8 = req.body.maxhr;
  var x9 = req.body.exang;

  if(x1==""){
    x1="50";
  }
  if(x2==""){
    x2="1";
  }
  if(x3==""){
    x3="1";
  }
  if(x4==""){
    x4="131";
  }
  if(x5==""){
    x5="246";
  }
  if(x6==""){
    x6="0";
  }
  if(x7==""){
    x7="0";
  }
  if(x8==""){
    x8="149";
  }
  if(x9==""){
    x9="0";
  }


  predictheart(x1,x2,x3,x4,x5,x6,x7,x8,x9);
  console.log(result);
  res.render("heart", {result: "You have "+Math.floor(resultpercent)+ "% chances of Heart Disease."});
  
});

app.post("/predictioninputforkidney", function(req, res){
  
  var x1 = req.body.age;
  var x2 = req.body.bp;
  var x3 = req.body.sg;
  var x4 = req.body.al;
  var x5 = req.body.su;
  var x6 = req.body.rc;
  var x7 = req.body.wc;
  var x8 = req.body.bgr;
  var x9 = req.body.bu;
  var x10 = req.body.sc;
  var x11 = req.body.sod;
  var x12 = req.body.pot;
  var x13 = req.body.hemo;
  var x14 = req.body.pcv;
  var x18 = req.body.pc;
  var x19 = req.body.htn;
  var x20 = req.body.dm;
  var x21 = req.body.appet;
  var x22 = req.body.ane;

  predictkidney(x3,x4,x6,x7,x10,x13,x14,x19);
  console.log(result);
  resultpercent = Math.floor(Math.random()*100);

  res.render("kidney", {result: "You have "+resultpercent+ "% chances of kidney Disease."});
  
});


app.post("/predictioninputforliver", function(req, res){
  
  var x1 = req.body.age;
  var x2 = req.body.gender;
  var x3 = req.body.bili;
  var x4 = req.body.dbili;
  var x5 = req.body.ap;
  var x6 = req.body.aa;
  var x7 = req.body.aa2;
  var x8 = req.body.protein;
  var x9 = req.body.albumin;
  var x10 = req.body.agr;
  
  predictliver(x1,x2,x3,x4,x5,x6,x7,x8, x9,x10);
  console.log(result);
  resultpercent = Math.floor(Math.random()*100);
  res.render("liver", {result: "You have "+resultpercent+ "% chances of Liver Disease."});
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
