var middlewareObj = {};
var Campground = require("../models/campModel");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash("error", "Please login first");
        res.redirect("/login");
    }
};

middlewareObj.chekCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;