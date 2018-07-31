'use strict'

/////////////////////////////////////////////////////////////////////////////////////
//   Imported Modules 
/////////////////////////////////////////////////////////////////////////////////////
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
////////////////////////////////////////////////////////////////////////////////////////
// Function 
//////////////////////////////////////////////////////////////////////////////////////////
// Function to validated email 
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
///////////////////////////////////////////////////////////////////////////////////////
//  Schema Design Follow the instructions below 
///////////////////////////////////////////////////////////////////////////////////////
var Schema = mongoose.Schema;

var userSchema = new Schema({

	fullName: {
		type: String,
		required: [true, 'The Name is Required']
	},
	emailAddress: {
		type: String,
		required:[true, 'The email address is required'],
		unique: true,
		validate: {
			validator: validateEmail
		}
	},
	password: {
		type: String,
		required: [true, 'You must have a password']
	},
	isAdmin: {type: Boolean, default: false}
})

//////////////////////////////////////////////////////////////////////////////
//Static Methods authenticate method to be exported the function find the name in the database and 
// sees if it exicts and then checks the password and compares it to the user password that was sent in
//////////////////////////////////////////////////////////////////////////////
userSchema.statics.authenticate =  function(email,password, callback ){
	// callback function logs them in or gives an error
	User.findOne({emailAddress:email})
		.exec(function(error, user){
			console.log(user)
			if(error){
				// if there is an error it will put the error in the call back funtion 
				return callback(error)
			}else if(!user){
					// if there is no user then it willl kick out a 401 error with the message
					var err = new Error('There is no user with that email address, please sign up')
					err.status = 401;
					return callback(err);
			}else{
				console.log(password)
				console.log(user.password)
				// compare password and userpasswrod
					bcrypt.compare(password, user.password, function(error, success){
						console.log(success);
						if(success=== true){
							return callback(null, user)
						}else{
							return callback(error)
						}
					})
			}
		})
}
//////////////////////////////////////////////////////////////////////////
//Pre save Hook   save and hasshes the password using the bcrypt module
/////////////////////////////////////////////////////////////////////////

userSchema.pre('save', function(next){

	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err){
		 return next(err)
		}
		user.password = hash;
		next();
	})
})
//////////////////////////////////////////////////////////////////////////////
//Model Created

var User = mongoose.model('user', userSchema);

module.exports = User;
