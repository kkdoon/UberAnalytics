var mongoose = require('mongoose');

var TripFrequencySchema = new mongoose.Schema({
    _id: {
        year: { type: Number, required: true},
        month: { type: Number, required: true},
        day: { type: Number, required: true}
    }
}, {collection: 'tripFrequencyByMonth'});

var TripFreq = mongoose.model('tripsFreq', TripFrequencySchema);

module.exports = TripFreq;