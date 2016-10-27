var express = require('express');
var router = express.Router();

var frame = require('./frame.js');
var player = require('./player.js');

// for now just get this working with one lane, then we will focus on adding multiple lanes

//hash table of players (key is player name)
let playerTable = {};

//throw takes in an player, and an int
function throw (int pins, player currentPlayer) {
  // normal frame
  if (currentPlayer.currentFrame < 9) {
    currentPlayer.frame[currentFrame].throw[currentPlayer.currentThrow] = pins;

    //strike!
    if (pins === 10 && currentPlayer.currentThrow == 0) {
      //set second throw to 0
      currentPlayer.frame[currentFrame].throw[currentPlayer.currentThrow + 1] = 0;

      //set score = 10, will need to update this score based on the next two throws (could be up to two frames if there are two more strikes)
      currentPlayer.frame[currentFrame].score = 10;
    }
  }
  //last frame
  else {

  }
})

router.get('/', function(req, res) {
  res.send(playerTable['Steve'].currentFrame + ' ' + playerTable['Bob'].frame[0].score);
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

//this will throw the ball
// router.post('/player/:id/throw', function(req, res) {
//   let selectedPlayer = 'player_' + req.params.id;
//
// }

module.exports = router;
