
//install packages
//npm init-y
//npm install Express
//npm install ejs
//npm install body-parser
//npm install mongoose
//npm install --save express-session
//npm install --save bcrypt-as-promised


//set up required modules
// Require the Express Module
const express = require('express');

// Create an Express App
const app = express();

// Integrate body-parser with our App
const bodyParser = require('body-parser');

// Require path
const path = require('path');

//Require mongoose
const mongoose = require('mongoose');

//Require session
const session = require('express-session')

// Use the session middleware
app.use(session({ secret: 'CodingDojo', cookie: { maxAge: 60000 }}))

// Set up body-parser to parse form data
app.use(bodyParser.urlencoded({extended: false}));

// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));

// Setting our Views Folder Directorycopy
app.set('views', path.join(__dirname, './views'));

// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

//Connect Mongoose to MongoDB
mongoose.connect('mongodb://localhost/Login_Registration');

//set up schema userSchema as new Schema
const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      minlength: 5,
      required: true,
      trim: true,
    },
    first_name: {
      type: String,
      minlength: 2,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      minlength: 2,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      validate: {
        validator: function( value ) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
      },
        message: "Password failed validation, you must have at least 1 number, uppercase and special character"
      }
    },
    birthday: String,
  });

  //set up schema in our Models as 'quote'
  mongoose.model('User', UserSchema);

  // Retrieve this Schema from our Models, named 'quote'
  const User = mongoose.model('User');

  // Use native promises
  mongoose.Promise = global.Promise;

//route that display index to register
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/hello', function(req, res, next) {
  if (req.session.views) {
   req.session.views++
   //res.setHeader('Content-Type', 'text/html')
  // res.write('<p>views: ' + req.session.views + '</p>')
  // res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
   res.render('hello')
 } else {
   req.session.views = 1
   console.log("session started")
   res.render('hello')
 }
});

app.get('/logout', function(req, res,next){
  req.session.destroy(function(err) {
  // cannot access session here
  if (err){
    console.log('Could not end session');
    res.redirect("/")
  }
  else{
    console.log("succesfully ended session");
    res.redirect('/');
  }
})
})

//create database entry if succesful and route to welcome page
app.post('/register', function (req, res){
  console.log("POST DATA", req.body);
  var user = new User({email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name, password: req.body.password, birthday: req.body.birthday});
  user.save(function(err){
   if (err){
     console.log('Something went wrong');
     console.log(user.errors);
     res.redirect("/")
   }
   else{
     console.log("succesffully added user");
     res.redirect('/hello');
   }
 })
});


//start a session if login succesful

app.listen(8000, function () {
    console.log("listening on port 8000");
})

//login page should be able to search database and direct to welcome page if true
