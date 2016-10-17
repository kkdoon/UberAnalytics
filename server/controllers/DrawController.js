var express = require('express');
var router = express.Router();
var validate = require('../util/RequestValidate');
var model = require('../models/index');
var limit = 200;

router.get('/draw/pickup', function (req, res) {
    validate(req);
    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;
    if(startDateTime == null || endDateTime == null){
        res.status(400).send(JSON.stringify({err: 'Provide startDate and endDate', msg: "Failed to get trips data from db"}));
        return;
    }

    model.trips.find({'startTime': {
        $gte:  new Date(Number(startDateTime)),
        $lte : new Date(Number(endDateTime))
    }}, function (err, docs) {
            if(err){
                res.status(500).send(JSON.stringify({err: err, msg: "Failed to get pickups from db"}));
                console.log(JSON.stringify({err: err, msg: "Failed to get pickups from db"}));
                return;
            }
            res.json(processGeojson(docs, true));
    }).limit(limit)
});

router.get('/draw/dropdown', function (req, res) {
    validate(req);
    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;
    if(startDateTime == null || endDateTime == null){
        res.status(400).send(JSON.stringify({err: 'Provide startDate and endDate', msg: "Failed to get trips data from db"}));
        return;
    }

    model.trips.find({'startTime': {
        $gte:  new Date(Number(startDateTime)),
        $lte : new Date(Number(endDateTime))
    }}, function (err, docs) {
        if(err){
            res.status(500).send(JSON.stringify({err: err, msg: "Failed to get dropdown from db"}));
            console.log(JSON.stringify({err: err, msg: "Failed to get dropdown from db"}));
            return;
        }
        res.json(processGeojson(docs, false));
    }).limit(limit)
});

router.get('/draw/trip', function (req, res) {
    validate(req);
    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;

    if(startDateTime == null || endDateTime == null){
        res.status(400).send(JSON.stringify({err: 'Provide startDate and endDate', msg: "Failed to get trips data from db"}));
        return;
    }

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
                    $gte:  new Date(Number(startDateTime)),
                    $lte : new Date(Number(endDateTime))
                }
            }, function (err, docs) {
                if (err) {
                    res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                    console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                    return;
                }
                res.json(processTripGeojson(docs));
            });
    } else {
        model.trips.find({
            'startTime': {
                $gte:  new Date(Number(startDateTime)),
                $lte : new Date(Number(endDateTime))
            }
        }, function (err, docs) {
            if (err) {
                res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                return;
            }
            res.json(processTripGeojson(docs));
        }).limit(limit);
    }
});

router.get('/draw/clusterPickups', function (req, res) {
    validate(req);
    var polygon = req.query.polygon;
    if (polygon == null) {
        res.status(400).send(JSON.stringify({err: "Parameter polygon is missing", msg: "Failed to get clustered pickup points"}));
        return;
    }

    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;

    if(startDateTime == null || endDateTime == null){
        res.status(400).send(JSON.stringify({err: 'Provide startDate and endDate', msg: "Failed to get cluster pickup data from db"}));
        return;
    }

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
            pickupPoint: {
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
                res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                return;
            }
            var response = processClusterGeojson(docs, false);
            //var response = cluster.clusterCalculate(geojsonResponse);
            //console.log(response);
            res.json(response);
        });

});

router.get('/draw/clusterTrips', function (req, res) {
    validate(req);
    var polygon = req.query.polygon;
    if (polygon == null) {
        res.status(400).send(JSON.stringify({err: "Parameter polygon is missing", msg: "Failed to get clustered pickup points"}));
        return;
    }

    var startDateTime =  req.query.startDate;
    var endDateTime =  req.query.endDate;

    if(startDateTime == null || endDateTime == null){
        res.status(400).send(JSON.stringify({err: 'Provide startDate and endDate', msg: "Failed to get cluster pickup data from db"}));
        return;
    }

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
                $gte:  new Date(Number(startDateTime)),
                $lte : new Date(Number(endDateTime))
            }
        }, function (err, docs) {
            if (err) {
                res.status(500).send(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                console.log(JSON.stringify({err: err, msg: "Failed to get trips from db"}));
                return;
            }
            var response = processClusterGeojson(docs, true);
            res.json(response);
        });
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

function processClusterGeojson(doc, isTrip){
    var result = [];
    for(var jsonObj in doc)
    {
        var jsonRow = [];
        jsonRow.push(doc[jsonObj]['_doc'].pickupPoint.coordinates[1]);
        jsonRow.push(doc[jsonObj]['_doc'].pickupPoint.coordinates[0])
        jsonRow.push(doc[jsonObj]['_doc']._id);
        result.push(jsonRow);
        if(isTrip){
            jsonRow = [];
            jsonRow.push(doc[jsonObj]['_doc'].dropdownPoint.coordinates[1]);
            jsonRow.push(doc[jsonObj]['_doc'].dropdownPoint.coordinates[0])
            jsonRow.push(doc[jsonObj]['_doc']._id);
            result.push(jsonRow);
        }
    }
    return result;
}

module.exports = router;