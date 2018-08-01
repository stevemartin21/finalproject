'use strict';


//This function is middleware that is put in to test if the user is logged in
//  it will see if there is a session created and if there is a userid created , I have attached this to several routes 

function checkLogin(req, res, next) {
  if (req.session && req.session.UserId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}

module.exports.checkLogin = checkLogin;
