const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memoriesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tripId: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City'
    },
    stories: [{
        imgCaption: String,
        description: String,
        imgName: String,
        imgPath: String,
    }],
});

const Memories = mongoose.model('Memory', memoriesSchema);
module.exports = Memories;