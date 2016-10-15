var express = require('express');
var router = express.Router();

var validation = function validateRequest(req){
    console.log(req.path)
};

module.exports = validation;