// add a pciture colleciton to the model  

'use strict'


 var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var pictureSchema = new Schema({
    title:  String,
    denomination: String,
    year:   Number,
    city: String,
    county: String,
    history: String,
    photo: { data: Buffer, contentType: String }
  });

  var Picture = mongoose.model('picture', pictureSchema);

  module.exports= Picture;