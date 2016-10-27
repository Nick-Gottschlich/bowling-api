var express = require('express');
var router = express.Router();

var frame = require('./frame.js');

class player {
	constructor(id) {
		this.id = id;
    this.frame = [];
		for (let i = 1; i <= 10; i++) {
      this.frame[i] = new frame(i);
    }
	}
}

let playerArray = [];

router.get('/', function(req, res) {
  res.send(playerArray[0].id + " " + playerArray[0].frame[10].test);
})

// creates a new player, ex: /player/steve creates a player with id steve (variable name for the player is also "player_steve")
// need to write something to make sure a player name can't be added twice
router.post('/player/:id', function(req, res){
	let playerName = "player_" + req.params.id;
	playerName = new player(req.params.id);
  playerArray.push(playerName);
	//need to do something here or it won't exit, res.send("something");
  res.send("Player " + req.params.id + " added to game.");
});

module.exports = router;
