var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var campRoutes = require("./routes/campRoute");
var indexRoutes = require("./routes/indexRoute");
var User = require("./models/userModel");
var passport = require("passport");
var LocalStrategy = require('passport-local');
var session = require('express-session');
var flash = require("connect-flash");
var slug = require("slug");

app.use(flash());
app.use(session({
  secret : "secret",
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://vanhoa66:hunghuong@ds255308.mlab.com:55308/campgrounds");

app.set("view engine", "ejs");

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use(campRoutes);
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Server is running...");
});
// var str1 = "Bàn ghế hội trường 1";
// var str2 = "Bàn ghế hội trường 2";
// var str3= "Bàn ghế hội trường 3";
// console.log(slug(str3, {lower: true}));
// console.log(slug(str2));
// console.log(slug(str3));
