var express = require("express");
var router = express.Router();
var User = require("../models/userModel");
var passport = require("passport");

router.get("/", function(req, res){
    res.redirect("/campgrounds");
});

router.route("/register")
    .get(function(req, res){
        //res.render("register");
        User.find({}, function(err, userAll){
            if(err){
                console.log(err);
                res.redirect("/");
            } else {
                res.render("register", {user: userAll});
            }
        });
    })
    .post(function(req, res){
        var newuser = new User({username: req.body.username});
        User.register(newuser, req.body.password, function(err, newUser){
            if(err){
                console.log(err);
                req.flash("error", err.message);
                return res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Nice to meet " + newUser.username);
                    res.redirect("/campgrounds");
                });
            }
        });
    });
    
router.delete("/register/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/register");
        }
    });
 });
    
router.route("/login")
    .get(function(req, res){
        res.render("login", {messages: req.flash("error")});
    })
    .post(passport.authenticate('local', { failureRedirect: '/login' }), function(req, res){
        req.flash("success", "Nice to meet " + req.body.username);
        res.redirect("/campgrounds");
    });

router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "You are logout");
    res.redirect("/campgrounds");
});

module.exports = router;