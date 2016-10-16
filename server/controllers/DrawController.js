var express = require('express');
var router = express.Router();
var validate = require('../util/RequestValidate');
var model = require('../models/index');
    
router.get('/draw/pickup', function (req, res) {
    validate(req);
    /*var startDate = req.param.startDate;
    var endDate = req.param.endDate;
    if(startDate == null || endDate == null){
        startDate = "2014-04-01T00:00:00.000Z";
        endDate = "2014-04-01T23:59:59.999Z";
    }else{

    }*/

    model.trips.find({'startTime': {
        $gte: new Date("2014-04-01T00:00:00.000Z"),
        $lte : new Date("2014-04-01T23:59:59.999Z")
    }}, function (err, docs) {
            if(err){
                res.status(500).send(JSON.stringify({err: err, msg: "Failed to get pickups from db"}));
                console.log(JSON.stringify({err: err, msg: "Failed to get pickups from db"}));
                return;
            }
            res.json(processGeojson(docs, true));
    }).limit(10).sort({ "_id":1})

});

router.get('/draw/dropdown', function (req, res) {
    validate(req);
    /*var startDate = req.param.startDate;
     var endDate = req.param.endDate;
     if(startDate == null || endDate == null){
     startDate = "2014-04-01T00:00:00.000Z";
     endDate = "2014-04-01T23:59:59.999Z";
     }else{

     }*/

    model.trips.find({'startTime': {
        $gte: new Date("2014-04-01T00:00:00.000Z"),
        $lte : new Date("2014-04-01T23:59:59.999Z")
    }}, function (err, docs) {
        if(err){
            res.status(500).send(JSON.stringify({err: err, msg: "Failed to get dropdown from db"}));
            console.log(JSON.stringify({err: err, msg: "Failed to get dropdown from db"}));
            return;
        }
        res.json(processGeojson(docs, false));
    }).limit(10).sort({ "_id":1})

});

router.get('/draw/trip', function (req, res) {
    validate(req);
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

        model.trips.find(
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
                    $gte: new Date("2014-04-01T00:00:00.000Z"),
                    $lte: new Date("2014-04-01T23:59:59.999Z")
                }
            }, function (err, docs) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                    console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                    return;
                }
                res.json(processTripGeojson(docs));
            }).limit(10);
    } else {
        model.trips.find({
            'startTime': {
                $gte: new Date("2014-04-01T00:00:00.000Z"),
                $lte: new Date("2014-04-01T23:59:59.999Z")
            }
        }, function (err, docs) {
            if (err) {
                res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                return;
            }
            res.json(processTripGeojson(docs));
        }).limit(10).sort({"_id": 1});
    }
});

function processGeojson(doc, isPickup) {
 var json = {
     type: 'FeatureCollection',
     features: []
 };
    for(var jsonObj in doc)
    {
        var jsonRow = {
            type: "Feature",
            geometry: {type: "Point", coordinates: [0, 0]},
            properties: {'marker-color': '#BE9A6B', 'marker-symbol': 'star'}
        };

        if(isPickup) {
            jsonRow.geometry.coordinates[0] = doc[jsonObj]['_doc'].pickupPoint.coordinates[0];
            jsonRow.geometry.coordinates[1] = doc[jsonObj]['_doc'].pickupPoint.coordinates[1];
        }else{
            jsonRow.geometry.coordinates[0] = doc[jsonObj]['_doc'].dropdownPoint.coordinates[0];
            jsonRow.geometry.coordinates[1] = doc[jsonObj]['_doc'].dropdownPoint.coordinates[1];
        }
        json.features.push(jsonRow);
    }

    return json;
}

function processTripGeojson(doc) {
    var json = {
        type: 'FeatureCollection',
        features: []
    };

    for(var jsonObj in doc)
    {
        var jsonRow = {
            type: "Feature",
            geometry: {type: "LineString", coordinates: [[0, 0], [0, 0]]}
        };
        jsonRow.geometry.coordinates[0][0] = doc[jsonObj]['_doc'].pickupPoint.coordinates[0];
        jsonRow.geometry.coordinates[0][1] = doc[jsonObj]['_doc'].pickupPoint.coordinates[1];
        jsonRow.geometry.coordinates[1][0] = doc[jsonObj]['_doc'].dropdownPoint.coordinates[0];
        jsonRow.geometry.coordinates[1][1] = doc[jsonObj]['_doc'].dropdownPoint.coordinates[1];
        json.features.push(jsonRow);
    }

    return json;
}

module.exports = router;