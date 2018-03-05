var express = require("express");
var router = express.Router();
var Campground = require("../models/campModel");
var Comment = require("../models/commentModel");
var middleware = require("../middleware/middleware");

router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
             res.render("campgrounds", {campgrounds:campgrounds}); 
        }
    });
});


router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("newCamps");
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image:image, author: author};
    Campground.create(newCampground, function(err, newCamp){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "You have post " + newCamp.name + " success");
            res.redirect("/campgrounds");
        }
    });
});

router.route("/campgrounds/:id")
    .get(middleware.chekCampOwnership, function(req, res){
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
            if(err){
                console.log(err);
            } else {
                Comment.find({}, function(err, allComments){
                    if(err){
                        console.log(err);
                    } else {
                        res.render("showCamps", {campground: foundCamp, comments: allComments});
                    }
                });
            }
        });
    })
    .put(function(req, res){
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCamp){
            if(err){
                console.log(err);
            } else {
                res.redirect("/campgrounds/"+ req.params.id);
            }
        });
    })
    .delete(function(req, res){
        Campground.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        });
    });

router.get("/campgrounds/:id/edit", middleware.chekCampOwnership, function(req, res) {
     Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            res.render("editCamps", {campground: foundCamp});
        }
    });
});

router.post("/campgrounds/:id/comments", function(req, res) {
     Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            var text = req.body.text;
            var author = {
                id: req.user._id,
                username: req.user.username
            };
            var newComment = {text: text, author: author};
            Comment.create(newComment, function(err, newComment){
                if(err){
                    console.log(err);
                } else {
                    foundCamp.comments.push(newComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    });
});

router.delete("/campgrounds/:id/comments/:idCom", function(req, res){
    Comment.findByIdAndRemove(req.params.idCom, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
 });
    

module.exports = router;