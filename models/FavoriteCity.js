const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteCitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  },
  imageUrl: String
});

const FavoriteCity = mongoose.model('FavoriteCity', favoriteCitySchema);

module.exports = FavoriteCity;