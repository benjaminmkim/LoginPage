const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const expressEjsLayout = require('express-ejs-layouts')
const { MongoClient } = require("mongodb");
require("./config/passport")(passport)
require('dotenv').config()

//Setting up mongoose to connect to the MongoDB server. 
//Pulls server ID from .env file.
const server_id = process.env.SERVER_ID;
mongoose.connect(server_id)
.then(() => console.log('connected'))
.catch((err)=> console.log(err));

//Setting express to use EJS 
app.set('view engine','ejs');
app.use(expressEjsLayout);

app.use(express.urlencoded({extended : false}));

//Initializing express session
app.use(session({
	secret : 'secret',
	resave : true,
	saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

//Setting up flash for the error/success messages
app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
	next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(3000); 