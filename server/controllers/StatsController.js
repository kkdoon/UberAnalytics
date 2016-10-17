var express = require('express');
var router = express.Router();
var validate = require('../util/RequestValidate');
var model = require('../models/index');

router.get('/stats/tripFrequency', function (req, res) {
    validate(req);

    model.tripFrequency.find({}, {  _id: 1, count: 1} , function (err, docs) {
        if(err){
            res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trip frequency from db"}));
            console.log(JSON.stringify({err: err, msg: "Failed to get trip frequency from db"}));
            return;
        }
        res.json(processResponse(docs));
    }).sort({ "_id":1});
});

router.get('/stats/tripCount', function (req, res) {
    validate(req);
    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;

    var polygon = req.query.polygon;
    if (polygon != null) {
        var vals = polygon.split(',');
        var coordinates = [];
        var result = [];

        for (var val = 0; val < vals.length - 1; val += 2) {
            var json = [];
            json.push(vals[val]);
            json.push(vals[val + 1]);
            result.push(json);
        }
        coordinates.push(result);

        model.trips.count(
            {
                tripPoints: {
                    $geoWithin: {
                        $geometry: {
                            type: "Polygon",
                            coordinates: coordinates
                        }
                    }
                },
                startTime: {
                    $gte:  new Date(Number(startDateTime)),
                    $lte : new Date(Number(endDateTime))
                }
            }, function (err, docs) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Failed to get total trip count from db"}));
                    console.log(JSON.stringify({err: err, msg: "Failed to get total trip count from db"}));
                    return;
                }
                res.json(docs);
            });
    } else {
        if(startDateTime == null || endDateTime == null){
            model.trips.count({}
            , function (err, docs) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Failed to get total trip count from db"}));
                    console.log(JSON.stringify({err: err, msg: "Failed to get total trip count from db"}));
                    return;
                }
                res.json(docs);
            });
        }else {
            model.trips.count({
                'startTime': {
                    $gte: new Date(Number(startDateTime)),
                    $lte: new Date(Number(endDateTime))
                }
            }, function (err, docs) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Failed to get total trip count from db"}));
                    console.log(JSON.stringify({err: err, msg: "Failed to get total trip count from db"}));
                    return;
                }
                res.json(docs);
            });
        }
    }
});

function processResponse(docs){
    var json = [];
    for(var jsonObj in docs) {
        var jsonRow = [];
        var year = docs[jsonObj]['_doc']._id.year;
        var month = docs[jsonObj]['_doc']._id.month -1;
        var day = docs[jsonObj]['_doc']._id.day;
        jsonRow.push(Date.UTC(year, month, day));
        jsonRow.push(docs[jsonObj]['_doc'].count);
        json.push(jsonRow);
    }
    return json;
}

module.exports = router;