const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  code: String,
  name: String,
  phone: String,
  continent: String,
  capital: String,
  currency: String,
  language: [{
    type: Schema.Types.ObjectId,
    ref: 'Language'
  }],
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;