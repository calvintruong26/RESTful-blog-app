var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//title
//image
//body
//created


//mongoose model config
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "My First Blog",
//   image: "https://images.unsplash.com/photo-1451479456262-b94f205059be?dpr=2&auto=format&crop=entropy&fit=crop&w=1500&h=1000&q=80",
//   body: "This is my first blog post!!!! Let's go baby!!!!!"
// });

//routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
});


//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if (err) {
           console.log(err);
       } 
       else {
           res.render("index", {blogs: blogs}); 
       }
    });
});

//NEW
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.santize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlogPost){
       if (err) {
           console.log(err);
           res.render("new");
       }
       else {
           res.redirect("/blogs");
       }
   });
});

//SHOW
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       if (err) {
           res.redirect("/blogs");
       } 
       else {
           res.render("edit", {blog: foundBlog});
       }
    });
});

//UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if (err) {
          res.redirect("/blogs");
      } 
      else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DESTROY
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/blogs");
       } 
       else {
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server running!");
});

