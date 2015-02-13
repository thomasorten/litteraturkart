'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  name: String,
  info: String,
  lat: Number,
  lon: Number
});

module.exports = mongoose.model('Place', PlaceSchema);