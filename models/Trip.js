const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  },
  memory: {
    type: Schema.Types.ObjectId,
    ref: 'Memory'
  },
  fromDate: Date,
  toDate: Date,
  travellersNum: Number,
  cost: Number,
  summary: String,
  rating: Number,
  img_default: String,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;