const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vacationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City'
    },
    travelers: {
        type: Number,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    preferences: String,
    image: String
}, { timestamps: true });

const Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;