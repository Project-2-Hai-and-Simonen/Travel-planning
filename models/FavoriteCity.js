const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteCitySchema = new Schema({
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  },
  imageUrl: String
});

const FavoriteCity = mongoose.model('FavoriteCity', favoriteCitySchema);

module.exports = FavoriteCity;