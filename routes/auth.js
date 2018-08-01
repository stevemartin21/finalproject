//Required modules
var express = require('express');
var router = express.Router();


//required mimported files
const Users = require('../models/user');
var middleware = require('../middleware/authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});
// registes new user 
router.post('/', function(req,res, next){
	console.log(req.body)
	// Test for user that already exisits with email and if the search returns a user 
	if(!req.body.fullName || !req.body.emailAddress || !req.body.password){
		let err = new Error('There is some missing information')
		err.status = 400;
		next(err)
	}else{
		console.log(req.body)
			Users.findOne({emailAddress:req.body.emailAddress}, function(error, user){
				console.log(user)
					if(user){
						var err = new Error('There is already a user with that email')
						err.status = 400;
						next(err)
					}else if(!user){
						 //Grab informaton from the filled out forms and create a new user when the route is run
						Users.create(req.body, function(error, user){
							if(req.body.adminCode === 'secretcode123') {
								      user.isAdmin = true;
								    }
								    console.log(user)

							// check to see if it has all of the information
							if(error){
								let err = new Error('there was an error with creating the user');
								err.status =  400;
								next(err)
							}else{//  set the status to 201 for the response and the location header to '/' and return no content
								res.redirect('/auth/login')	
							}
						})
					}
			});
	}
});

// grab log in page
router.get('/login', function(req, res, next){
		res.render('login')
	})	
//logs user an and incorporates middlesway to check if use exists and creates a unique session
router.post('/login', middleware.checkUser ,  function(req,res, next){
})

// Log out route 
router.get('/logout', function(req, res, next){
	console.log(req.session)

	if(req.session){
		req.session.destroy(function(err){
			if(err){
				return next (err)
			}else{
				return res.redirect('/')
			}
		})
	}
})

module.exports = router;

