var express = require('express');
var router = express.Router();

var frame = require('./frame.js');
var player = require('./player.js');

// for now just get this working with one lane, then we will focus on adding multiple lanes
// i think im going to want to move the routing stuff at the bottom of this out into a file called routing.js, which can call this lane file

//hash table of players (key is player name)
let playerTable = {};

//throw takes in an player, and an int
//think im gonna move this entire function into a different file just to clean up this one
function throwBall (pins, currentPlayer) {
  // there's lot of repeated code here that I can either move out of if statements or turn into another function
  // normal frame
  if (currentPlayer.currentFrame < 9) {
    currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

    // strike!
    if (pins === 10 && currentPlayer.currentThrow === 0) {
      currentPlayer.frame[currentPlayer.currentFrame].strike = true;

      currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

      // currentPlayer.frame[currentFrame].score = 10;

      // update the previous frame if it is a strike or spare

      // update the previous previous frame if it is a strike (and the last frame was also a strike!)

      //increment currentThrow (since we skip the second throw, we will act as if this was the second throw)
      currentPlayer.currentThrow++;
    }

    // spare!
    // checks to see if this is the second throw, and if the first throw plus this throw's pins equals 10
    else if (currentPlayer.currentThrow === 1 && (currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow - 1] + pins === 10)) {
      currentPlayer.frame[currentPlayer.currentFrame].spare = true;

      currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

      // currentPlayer.frame[currentFrame].score = 10;

      //update the previous frame if it is a strike
    }

    currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

    currentPlayer.frame[currentPlayer.currentFrame].score = parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[0]) + parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[1]);

    if (currentPlayer.currentThrow === 1) {
      currentPlayer.currentFrame++;
      currentPlayer.currentThrow = 0;
    }
    else {
      currentPlayer.currentThrow++;
    }
  }
  //last frame
  else {

  }
}

function updateTotalScore(currentPlayer) {
  let hold = 0;
  for (let i = 0; i < 10; i++) {
    hold += parseInt(currentPlayer.frame[i].score);
  }
  currentPlayer.totalScore = hold;
}

router.get('/', function(req, res) {
  res.send('Steve is on frame ' + playerTable['Steve'].currentFrame + ' , this frame has throw0: ' +
  playerTable['Steve'].frame[playerTable['Steve'].currentFrame].throws[0] + ' and throw1: ' +
  playerTable['Steve'].frame[playerTable['Steve'].currentFrame].throws[1] + ' and total score is: ' +
  playerTable['Steve'].totalScore);
});

// creates a new player, ex: /player/Steve creates a player with id Steve (key for player will be 'Steve') (case sensitive!)
// need to write something to make sure a player name can't be added twice
router.post('/player/:id', function(req, res){
  playerTable[req.params.id] = new player();

  res.send('Player ' + req.params.id + ' added to game.');
});

// remove a player from the game by ID
router.delete('player/:id', function(req,res) {
  delete playerTable[req.params.id];

  res.send('Player ' + req.params.id + ' removed from game.')
});

// this will throw the ball (id is name of player, name is number of pins knocked down)
router.post('/player/:id/throw/:name', function(req, res) {
  let selectedPlayer = playerTable[req.params.id];
  let pins = req.params.name;
  throwBall(pins, selectedPlayer);
  updateTotalScore(selectedPlayer);
  // probably need to update players total score after the throw
  res.send('Player ' + req.params.id + ' knocked down ' + req.params.name + ' pins!');
});

module.exports = router;
