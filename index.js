var express = require('express');
var app = express();

var lane = require('./lane.js');

app.use('/lane', lane);

app.listen(3000);
