
const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    altitude: {
        type: Number,
        required: false
    },
    time: Number
});

const TrackingSchema = new mongoose.Schema({
    startTime: Number,
    endTime: Number,
    path: [PositionSchema],
    tag: String
});

const ShareScheme = new mongoose.Schema({
    tracking: TrackingSchema,
    date: { 
        type: Date, 
        default: Date.now 
    },
    hash: String
});

const Share = mongoose.model('Share', ShareScheme);

module.exports = Share