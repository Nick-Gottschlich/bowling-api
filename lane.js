var express = require('express');
var router = express.Router();

var frame = require('./frame.js');

class player {
	constructor(id) {
		this.id = id;
		frame[1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	}
}

router.get('/', function(req, res) {
	res.send(frame)
})

// creates a new player, ex: /player/steve creates a player with id steve (variable name for the player is also "player_steve")
router.post('/player/:id', function(req, res){
	//set the player name to the id
	let playerName = "player_" + req.params.id;
	res.send(playerName);
	playerName = new player(req.params.id);
	res.send (playerName.id);
});

module.exports = router;
