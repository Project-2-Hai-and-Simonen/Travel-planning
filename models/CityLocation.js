const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cityLocationSchema = new Schema({
  name: String,
  country: String,
  longitude: Number,
  latitude: Number,
  flag: String,
});

const CityLocation = mongoose.model('CityLocation', cityLocationSchema);

module.exports = CityLocation;