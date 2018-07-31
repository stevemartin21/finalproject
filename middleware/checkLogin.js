'use strict';




/*
function checkLogin(req, res, next) {
  if (req.session && req.session.UserId) {
    return res.redirect('/addChuch');
  }
  return next();
}

*/


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
