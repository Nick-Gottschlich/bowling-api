var express = require('express');
var app = express();

var game = require('./game.js');

app.use('/game', game);

app.listen(3000);
