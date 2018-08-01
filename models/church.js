 

'use strict'
// This is a basic model to define the information on each individual church

 var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var churchSchema = new Schema({
    title:  String,
    denomination: String,
    year:   Number,
    city: String,
    county: String,
    history: String
  });

  var Church = mongoose.model('church', churchSchema);

  module.exports= Church;