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
var mysql = require("mysql");
const { Pool, Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'camps',
  password: 'hunghuong',
  port: 5432,
});
client.connect();

app.use(flash());
app.use(session({
  secret: "secret",
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://vanhoa66:hunghuong@ds255308.mlab.com:55308/campgrounds");

app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
// app.use(campRoutes);
app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("Server is running...");
});
// ---------------pg........
app.get("/campgrounds", (req, res) => {
  console.log("ket noi ok");
  client.query('SELECT * FROM camp ORDER BY id ASC', (err, results) => {
    // console.log(results.rows[0].name);
    res.render("campgrounds", { campgrounds: results.rows });
    //client.end()
  })
});
app.get("/campgrounds/new", function (req, res) {
  res.render("newCamps");
});
app.post("/campgrounds", function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.editor1;
  const query = {
    text: 'INSERT INTO camp(name, image, description) VALUES($1, $2, $3)',
    values: [name, image, description],
  };
  client.query(query)
    .then(res1 => console.log(res1.rows[0]))
    .catch(e => console.error(e.stack))
  res.redirect("/campgrounds");
});
app.get("/campgrounds/:id/edit", function (req, res) {
  var id = req.params.id;
  const query = {
    text: 'SELECT * FROM camp WHERE id=$1',
    values: [id],
  };
  client.query(query)
    .then(foundCamp => res.render("editCamps", { campground: foundCamp.rows[0] }))
    .catch(e => console.error(e.stack))
});

app.route("/campgrounds/:id")
  .get(function (req, res) {
    var id = req.params.id;
    const query = {
      text: 'SELECT * FROM camp WHERE id=$1',
      values: [id],
    };
    client.query(query)
      .then(foundCamp => res.render("showCamps", { campground: foundCamp.rows[0] }))
      .catch(e => console.error(e.stack))
    //res.render("showCamps", { campground: foundCamp[0] });
  })
  .put(function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.editor1;
    var id = req.params.id;
    const query = {
      text: 'UPDATE camp SET name=($1), image=($2), description=($3) WHERE id=($4)',
      values: [name, image, description, id],
    };
    client.query(query)
      .then(() => res.redirect("/campgrounds"))
      .catch(e => console.error(e.stack))

  })
  .delete(function (req, res) {
    var id = req.params.id;
    client.query('DELETE FROM camp WHERE id=$1', [id])
      .then(() => res.redirect("/campgrounds"))
      .catch(e => console.error(e.stack))
  });
// -----------------mysql----
// var condb = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "camps"
// });

// condb.connect(function (err) {
//   if (err) {
//     console.log(err);
//     throw err;
//   } else {
//     console.log("da ket noi");
//     // var sql = "INSERT INTO camp (name, image, description) VALUES ('ban may tinh', 'https://gscvietnam.com/images/201711/thumb_img/bo-ban-ghe-tre-em-bb10_2366.jpg', 'hello')";
//     // condb.query(sql, function(err, camp){
//     //   if (err) throw err;
//     //   console.log("1 record inserted");
//     // })
//   }
// });

// app.get("/campgrounds", (req, res) => {
//   var sql = "SELECT * FROM camp";
//   condb.query(sql, function (err, results) {
//     if (err) throw err;
//     //nconsole.log(json(results));
//     res.render("campgrounds", { campgrounds: results });
//   });
// });

// app.post("/campgrounds", function (req, res) {
//   var name = req.body.name;
//   var image = req.body.image;
//   var description = req.body.editor1;
//   //  var newCampground = { name: name, image: image, description: description }
//   var sql = "INSERT INTO camp (name, image, description) VALUES ('" + name + "', '" + image + "', '" + description + "')";
//   condb.query(sql, function (err, newCamp) {
//     if (err) throw err;
//     console.log("1 record inserted");
//     res.redirect("/campgrounds");
//   })
// });
// app.route("/campgrounds/:id")
//   .get(function (req, res) {
//     var sql = "SELECT * FROM camp WHERE id = '" + req.params.id + "'";
//     condb.query(sql, function (err, foundCamp) {
//       if (err) throw err;
//       res.render("showCamps", { campground: foundCamp[0] });
//     });
//   })
//   .put(function (req, res) {
//     var name = req.body.name;
//     var image = req.body.image;
//     var description = req.body.editor1;
//     var sql = "UPDATE camp SET name='" + name + "', image='" + image + "', description='" + description + "' WHERE id = '" + req.params.id + "'";
//     condb.query(sql, function (err, updateCamp) {
//       if (err) throw err;
//       console.log("1 record inserted");
//       res.redirect("/campgrounds/" + req.params.id);
//     })
//   })
//   .delete(function (req, res) {
//     var sql = "DELETE FROM camp WHERE id = '" + req.params.id + "'";
//     condb.query(sql, function (err, deleteCamp) {
//       if (err) throw err;
//       res.redirect("/campgrounds");
//     });
//   });
// app.get("/campgrounds/:id/edit", function (req, res) {
//   var sql = "SELECT * FROM camp WHERE id = '" + req.params.id + "'";
//   condb.query(sql, function (err, foundCamp) {
//     if (err) throw err;
//     res.render("editCamps", { campgrounds: foundCamp });
//   });
// });

