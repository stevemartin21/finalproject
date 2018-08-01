//Required npm packages
var express = require('express');
var router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
//Required files
const Churches = require('../models/church');
const theKey = require('../models/map');
// Automatically in module

var Users = require('../models/user');
var Photos = require('../models/photo');
var middleware = require('../middleware/checkLogin');


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session)
  res.render('home2');
});
//Adds a church to database and makes user user is logged in first 
router.get('/addChurch', middleware.checkLogin, function(req, res, next){
	console.log(req.session)
		res.render('addChurch')
})
//Adds church and redirects to all churches page
router.post('/addChurch', middleware.checkLogin, function(req, res, next){
	console.log(req.body)
	Churches.create(req.body, function(error, church){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log('success')
			res.redirect('/allChurches')
		}
	})
})
//  Adds a photo to databased
router.get('/addPhoto', middleware.checkLogin, function(req, res, next){
	console.log(req.session)
		res.render('addPhoto')
})
//  Adds a photo to databased
router.post('/addPhoto', middleware.checkLogin, function(req, res, next){
	console.log(req.body)
	Photos.create(req.body, function(error, picture){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log(picture)
			res.redirect('/allChurches')
		}
	})
})
// Grabs and displays all churches info
router.get('/allChurches', middleware.checkLogin, function(req, res, next){
	console.log(req.body)
	Churches.find({
	})
		.exec(function(error, churches){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log(churches)
		res.render('allChurches', {churches:churches})
	}
	})	
})
///edit based on the id that is displayed
router.get('/editChurch/:id', middleware.checkLogin, function(req, res, next){
	Churches.findById(req.params.id)
		.exec(function(error, church){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log(church)
		res.render('editChurch2', {church:church})
	}
	})	
})
// updates the church based on the id and uses method overrited to do it
router.put('/editChurch/:id', middleware.checkLogin, function(req, res, next){
	Churches.findByIdAndUpdate(req.params.id, { $set: req.body }, function(error, church){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log(church)
			console.log('its been updated')
			res.status(204);
			res.redirect('/allChurches')
		}
	})		
})
// Delete Church route
router.get('/delChurch/:id', middleware.checkLogin, function(req, res, next){
	Churches.findById(req.params.id)
		.exec(function(error, church){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log(church)
		res.render('delChurch2', {church:church})
	}
	})	
})
// Uses method overirte to delete church 
router.delete('/delChurch/:id', middleware.checkLogin, function(req, res, next){
	Churches.findByIdAndRemove(req.params.id, function(error, church){
		if(error){
			let err = new Error('there was an error with creating the Church');
			err.status =  400;
			next(err)
		}else{
			console.log(church)
			console.log('its been deleted')
			res.status(204);
			res.redirect('/allChurches')	
		}
	})	
})

// Grabs the patrong route and also used json placeholder to grab names
router.get('/patrons', function(req, res, next){
	axios.get('https://jsonplaceholder.typicode.com/users')
	.then(function(response){
		var usernames = response.data
		res.render('patrons', {usernames:usernames})
	}).catch(function(err){
		res.send(500)
	})
})
//  Gras the map view
router.get('/map', function(req, res, next){
	console.log(theKey)
	res.render('map', {theKey:theKey})
})


module.exports = router;

