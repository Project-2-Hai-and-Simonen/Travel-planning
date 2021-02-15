const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const top10CitesSchema = new Schema({
  name: String,
  country: String, // can not make relation here because of lage data
  population: Number,
  loc: {
    type: {type: String},
    coordinates: [Number]
  },
});
top10CitesSchema.index({loc: "2dsphere"});

const Top10City = mongoose.model('Top10City', top10CitesSchema);

module.exports = Top10City;