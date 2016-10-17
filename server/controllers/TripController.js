var express = require('express');
var router = express.Router();
var validate = require('../util/RequestValidate');
var model = require('../models/index');
    
router.get('/trips', function (req, res) {
    validate(req);

    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;
    if(startDateTime == null || endDateTime == null){
        res.status(400).send(JSON.stringify({err: 'Provide startDate and endDate', msg: "Failed to get trips data from db"}));
        return;
    }

    var cursor = model.trips.find({'startTime': {
        $gte:  new Date(Number(startDateTime)),
        $lte : new Date(Number(endDateTime))
    }}/*, function (err, docs) {
        res.json(docs);
    }*/).limit(500).sort({ "_id":1}).cursor();

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