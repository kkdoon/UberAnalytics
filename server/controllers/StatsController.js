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