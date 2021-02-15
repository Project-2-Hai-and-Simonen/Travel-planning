const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memoriesSchema = new Schema({
    name: String,
    description: String,
    imgName: String,
    imgPath: String,
    //publicId: String
});

const Memories = mongoose.model('Memories', memoriesSchema);
module.exports = Memories;