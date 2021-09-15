const express = require('express');
const router  = express.Router();
const {ensureLoggedIn} = require("../config/auth.js")

//Welcome page
router.get('/', (req,res)=>{
  res.render('/users/login');
})

//Dashboard for after login
//Uses ensureLoggedIn to make sure the user is logged in before showing the dashboard.
//If not logged in, will redirect to the login page.
router.get('/dashboard', ensureLoggedIn, (req,res)=>{
  res.render('dashboard',{
    user:req.user
  });
})
module.exports = router; 