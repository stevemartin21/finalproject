 

'use strict'


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