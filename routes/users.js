const express = require('express');
const router = express.Router();
const User = require("../models/user.js")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { MongoClient } = require("mongodb");

//Login before submitting info
router.get('/login',(req,res)=>{
  res.render('login');
})

//Register before submitting info
router.get('/register',(req,res)=>{
  res.render('register')
})

//Register after submitting info
router.post('/register',(req,res)=>{
  const {first_name, last_name, email, password, password2} = req.body;
  let errors = [];
  if(!first_name || !last_name || !email || !password || !password2) {
    errors.push({msg : "Please fill in all fields"})
  }
  //Checks if the password and confirmation password match
  if(password !== password2) {
    errors.push({msg : "Passwords dont match"});
  }

  //Checks to make sure the password has at least 6 characters
  if(password.length < 6 ) {
    errors.push({msg : 'Password needs to be at least 6 characters long'})
  }

  //Checks to make sure password has a special character
  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
  if(!pattern.test(password)) {
    errors.push({msg : 'Password needs to contain at least one special character'})
  }

  if(errors.length > 0 ) {
    //rerender page with info still filled in
    res.render('register', {
      errors : errors,
      first_name : first_name,
      last_name : last_name,
      email : email,
      password : password,
      password2 : password2
    })
  }

  else {
    //Checks to see if the email is already in the DB
    User.findOne({email : email}).exec((err,user)=>{
    if(user) {
      errors.push({msg: 'email already registered'});
      res.render('register', {
        errors : errors,
        first_name : first_name,
        last_name : last_name,
        email : email,
        password : password,
        password2 : password2
      })
    }
    //Email not registered yet
    else {
      const newUser = new User({
        first_name : first_name,
        last_name : last_name,
        email : email,
        password : password
      });
      var saltRounds = 10;
      //Hash password with salt
      bcrypt.hash(newUser.password, saltRounds, (err, hash)=> {
        if(err) throw err;
        newUser.password = hash;
        newUser.save()
        .then((value)=>{
          console.log(value)
          req.flash('success_msg','You are now registered')
          res.redirect('/users/login');
        })
        .catch(value=> console.log(value));    
      });
    }
  })}
})

//Login after submitting info
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
      successRedirect : '/dashboard',
      failureRedirect : '/users/login',
      failureFlash : true,
    })(req,res,next);
  })

//Logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
 })
module.exports  = router;
