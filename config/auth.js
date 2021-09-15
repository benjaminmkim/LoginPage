module.exports = {
	//function ensureLoggedIn used to make sure user is logged in to view dashbaord
	ensureLoggedIn : function(req,res,next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/users/login');
	}
}