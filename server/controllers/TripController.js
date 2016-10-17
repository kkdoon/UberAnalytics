var express = require('express');
var router = express.Router();
var validate = require('../util/RequestValidate');
var model = require('../models/index');
    
router.get('/trips', function (req, res) {
    validate(req);

    var cursor = model.trips.find({'startTime': {
        $gte: new Date("2014-04-01T00:00:00.000Z"),
        $lte : new Date("2014-04-01T23:59:59.999Z")
    }}/*, function (err, docs) {
        res.json(docs);
    }*/).limit(10).sort({ "_id":1}).cursor();

    var prev = null;
    res.writeHead(200, {'Content-Type': "application/json" });
    res.write('[')
    cursor.on('data', function(doc) {
        if(prev)
            res.write(JSON.stringify(doc) + ',');
        prev = doc;
    });
    cursor.on('end', function() {
        if(prev)
            res.write(JSON.stringify(prev));
        res.end(']');
    });
    cursor.on('error', function (err) {
        res.end(JSON.stringify({err: err, msg: "Failed to get trips from db"}) + ']');
        console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
    });
});

module.exports = router;