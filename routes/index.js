var express = require('express');
var router = express.Router();

const Churches = require('../models/church');
// Automatically in module
const axios = require('axios');
const crypto = require('crypto');
var Users = require('../models/user');

var middleware = require('../middleware/checkLogin');


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session)
  res.render('home2');
});

router.get('/addChurch', middleware.checkLogin, function(req, res, next){
	console.log(req.session)
		res.render('addChurch')
})

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

///edit 

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


router.get('/patrons', function(req, res, next){
	axios.get('https://jsonplaceholder.typicode.com/users')
	.then(function(response){
		var usernames = response.data
		res.render('patrons', {usernames:usernames})
	}).catch(function(err){
		res.send(500)
	})
})




module.exports = router;

