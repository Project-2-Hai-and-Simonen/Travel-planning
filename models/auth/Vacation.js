const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vacationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        type: String,
        required: true
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
}, { timestamps: true });

const Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;