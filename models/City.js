const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: String,
  country: String, // can not make relation here because of lage data
  population: Number,
  loc: {
    type: {type: String},
    coordinates: [Number]
  },
});
citySchema.index({loc: "2dsphere"});

const City = mongoose.model('City', citySchema);

module.exports = City;