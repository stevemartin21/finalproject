// model schema for to upload photots, I still ahve a long way to go with this  

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

  var Picture = mongoose.model('photo', pictureSchema);

  module.exports= Picture;