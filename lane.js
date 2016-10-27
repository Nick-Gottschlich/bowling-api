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

playerTest = new player;

router.get('/', function(req, res) {
	res.send(playerTest.frame[10].test)
})

// what i should actually do is have an array of players, and this appends a new player to that array
// creates a new player, ex: /player/steve creates a player with id steve (variable name for the player is also "player_steve")
router.post('/player/:id', function(req, res){
	let playerName = "player_" + req.params.id;
	playerName = new player(req.params.id);
	//need to do something here or it won't exit, res.send("something");
});

module.exports = router;
