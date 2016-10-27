var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send('This is the game so far.')
})

router.post('/', function(req, res){
	res.send('You started a new game.');
});

module.exports = router;
