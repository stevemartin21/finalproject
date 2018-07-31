'use strict';
////////////////////////////////////////////////////////////////////
//Included Modules 
//User Model 
var Users = require('../models/user');
// NPM Modules 
//var auth = require('basic-auth');
/////////////////////////////////////////////////
//Functions 
////////////////////////////////////////////////////////////////////
//  Need to create function and incorporate basic auth taken from the req
 function checkUser(req, res, next){
	var verify = req.body
	//console.log(verify.name)
	//console.log(verify.pass)
		if(verify.emailAddress && verify.password){

						// call static metod from User Model 
						Users.authenticate(verify.emailAddress, verify.password, function(error, user){

							// validate if there is no user 
							console.log(user);
							if(error){
								// set error code 
								var err = new Error('There was an error on authenticate')
								err.status = 401;
								next(err)
							}else if( !user){
								// Set error code if there is no user 
								var err2 = new Error('No User found or incorrect password');
								err2.status = 401;
								next(err2)
							}else{
								// make user is avaialble for each middlewware
								req.session.UserId =user._id // If the authenticate method returns the user, then set the user document on the request so that each following middleware function has access to it.
								console.log(req.session)
								res.redirect('/allChurches')
								
							}
						})
			}	
		else{
			// Find the user with the email addres s
			var err = new Error('You must have a username and / or password to continue');
			err.status = 400;
			next(err);
		}
}






module.exports.checkUser = checkUser;