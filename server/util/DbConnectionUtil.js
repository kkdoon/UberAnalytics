var mongoose = require('mongoose');
var settings = require('../config/settings');
mongoose.Promise = require('bluebird');

var environment = process.env.NODE_ENV || 'dev';
var mongoCollection = settings.db.collection;
var mongoHostname = settings.db[environment].hostname;
// Connect to MongoDB
mongoose.connect('mongodb://' +  mongoHostname + '/' + mongoCollection, function (error) {
    if (error) {
        console.log(error);
    }else{
        console.log('Mongodb connected....');
    }
});

module.exports = mongoose;
