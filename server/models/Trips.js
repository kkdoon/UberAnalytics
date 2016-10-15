var mongoose = require('mongoose');

// Trip model
var TripSchema = new mongoose.Schema({
    startTime : { type : Date, default: Date.now, required: true },
    endTime : { type : Date, default: Date.now, required: true },
    pickupPoint : {
            lat: { type: Number, required: true},
            lon: { type: Number, required: true}
    },
    dropdownPoint : {
        lat: { type: Number, required: true},
        lon: { type: Number, required: true}
    }
}, {collection: 'trips'});

var Trips = mongoose.model('trips', TripSchema);

module.exports = Trips;