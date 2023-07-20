const mongoose = require('mongoose');

const WaitersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
        },
    phone: {
        type: String
        },
    email: {
        type: String
    },
    address: {
        type: String
    },
    picture: {
        type: String
    }
});

const Waiters = mongoose.model('Waiters', WaitersModel);

module.exports = Waiters;

