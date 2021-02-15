const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
  code: String,
  name: String,
  native: String,
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;