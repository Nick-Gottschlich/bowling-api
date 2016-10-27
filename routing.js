var express = require('express');
var router = express.Router();

var lane = require('./lane.js');
var player = require('./player.js');
var frame = require('./frame.js');

let laneCount = 0;
//this holds all the lanes, the key will be an incrementing integer (per game)
let laneTable = {};

//throwBall takes in an player, and an int
//need error checking for when a player throws something impossible (no negative numbers, and the two throws can never add up to equal more than 10)
function throwBall (pins, currentPlayer) {
  // there's lot of repeated code here that I can either move out of if statements or turn into another function
  // normal frame
  if (currentPlayer.currentFrame < 9) {
    currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

    // strike!
    if (pins === 10 && currentPlayer.currentThrow === 0) {
      currentPlayer.frame[currentPlayer.currentFrame].strike = true;

      currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

      //increment currentThrow (since we skip the second throw, we will act as if this was the second throw)
      currentPlayer.currentThrow++;
    }

    // spare!
    // checks to see if this is the second throw, and if the first throw plus this throw's pins equals 10
    else if (currentPlayer.currentThrow === 1 && (currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow - 1] + pins === 10)) {
      currentPlayer.frame[currentPlayer.currentFrame].spare = true;

      currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

      //update the previous frame if it is a strike
    }

    currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

    currentPlayer.frame[currentPlayer.currentFrame].score = parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[0]) + parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[1]);

    //case where last 2 frames are strikes
    if (currentPlayer.currentFrame > 1) {
      if (currentPlayer.frame[currentPlayer.currentFrame - 1].strike && currentPlayer.frame[currentPlayer.currentFrame - 2].strike) {
        //if this throw is a strike, two frames back gets +10
        if (currentPlayer.frame[currentPlayer.currentFrame].strike) {
          currentPlayer.frame[currentPlayer.currentFrame - 2].score += parseInt(10);
        }
      }
    }

    //case where last frame was strike
    if (currentPlayer.currentFrame > 0) {
      if (currentPlayer.frame[currentPlayer.currentFrame - 1].strike) {
        //if we hit a strike (we will be guaranteed to be on second throw in this case), previous frame gets +10
        if (currentPlayer.frame[currentPlayer.currentFrame].strike) {
          currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(10);
        }
        //else if we are on the second throw, add the score of this frame to the previous frame
        if (currentPlayer.currentThrow === 1) {
          currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(currentPlayer.frame[currentPlayer.currentFrame].score);
        }
      }
    }

    // case where last frame was spare
    if (currentPlayer.currentFrame > 0) {
      if (currentPlayer.frame[currentPlayer.currentFrame - 1].spare) {
        //if we hit a strike, previous frame gets +10
        if (currentPlayer.frame[currentPlayer.currentFrame].strike) {
          currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(10);
        }
        //else if we are on the first throw, add the score of this frame to the previous frame
        if (currentPlayer.currentThrow === 0) {
          currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(pins);
        }
      }
    }

    if (currentPlayer.currentThrow === 1) {
      currentPlayer.currentFrame++;
      currentPlayer.currentThrow = 0;
    }
    else {
      currentPlayer.currentThrow++;
    }
  }
  //last frame
  // else if {
  //
  // }
}

function updateTotalScore(currentPlayer) {
  let hold = 0;
  for (let i = 0; i < 10; i++) {
    hold += parseInt(currentPlayer.frame[i].score);
  }
  currentPlayer.totalScore = hold;
}

// building an ASCII scorecard to show to when GET is called on a specific player in a specific game
function buildScoreCard(player) {
  let line =       ' -----------------------------------------------------------------------------' + '\n';
  let frameText =  '| Frames        |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10   |' + '\n';

  let resultText = '| Result        |';
  // if throw[y] === 10 we should output X or / instead of the number 10
  for (let i = 0; i < 9; i++) {
    resultText += ' ' + player.frame[i].throws[0] + ' ' + player.frame[i].throws[1] + ' |';
  }
  resultText += ' ' + player.frame[9].throws[0] + ' ' + player.frame[9].throws[1] + ' ' + player.frame[9].throws[2] + ' |' + '\n';

  // will need cases for when score is 1 and 2 digits
  frameScoreText = '| Frame Score   |';
  for (let i = 0; i < 9; i++) {
    if (player.frame[i].score >= 10) {
      frameScoreText += ' ' + player.frame[i].score + '  |';
    }
    else {
      frameScoreText += '  ' + player.frame[i].score + '  |';
    }
  }
  if (player.frame[9].score >= 10) {
    frameScoreText += '  ' + player.frame[9].score + '   |' + '\n';
  }
  else {
    frameScoreText += '   ' + player.frame[9].score + '   |' + '\n';
  }

  // will need cases for when score is 1, 2, and 3 digits
  runningTotalText = '| Running Total |';
  for (let i = 0; i < 9; i++) {
    if (player.totalScore >= 100) {
      runningTotalText += ' ' + player.totalScore + ' |';
    }
    else if (player.totalScore >= 10) {
      runningTotalText += ' ' + player.totalScore + '  |';
    }
    else {
      runningTotalText += '  ' +  player.totalScore + '  |';
    }
  }
  if (player.totalScore >= 100) {
    runningTotalText += '  ' + player.totalScore + '   |' + '\n';
  }
  else if (player.totalScore >= 10) {
    runningTotalText += '  ' + player.totalScore + '    |' + '\n';
  }
  else {
    runningTotalText += '   ' +  player.totalScore + '   |' + '\n';
  }

  bigstring = line + frameText + line + resultText + line + frameScoreText + line + runningTotalText + line;

  return bigstring;
}

router.get('/lane/:laneid/player/:playerid', function(req, res) {
  // res.send('Steve is in frame ' + laneTable[0].playerTable['Steve'].currentFrame + ' , \n this frame has throw0: ' +
  // laneTable[0].playerTable['Steve'].frame[laneTable[0].playerTable['Steve'].currentFrame].throws[0] + ' and throw1: ' +
  // laneTable[0].playerTable['Steve'].frame[laneTable[0].playerTable['Steve'].currentFrame].throws[1] + ' and total score is: ' +
  // laneTable[0].playerTable['Steve'].totalScore);

  //res.sendFile(path.join(__dirname+'/lane.html'));
  // let output = buildScoreCard(req.params.laneid, req.params.playerid);
  res.send(buildScoreCard(laneTable[req.params.laneid].playerTable[req.params.playerid]));
});

//creates a new lane, ex: /lane creates a lane with key '0'
router.post('/lane/', function(req,res) {
  laneTable[laneCount] = new lane();
  thisLane = laneCount;
  laneCount++;

  res.send('You began a game in lane: ' + thisLane + '\n');
});

// creates a new player, ex: /player/Steve creates a player (key for player will be 'Steve') (case sensitive!)
// need to write something to make sure a player name can't be added twice
router.post('/lane/:laneid/player/:playerid', function(req, res){
  laneTable[req.params.laneid].playerTable[req.params.playerid] = new player();

  res.send('Player ' + req.params.playerid + ' added to game.\n');
});

// remove a player from the game by ID
router.delete('/lane/:laneid/player/:playerid', function(req,res) {
  delete laneTable[req.params.laneid].playerTable[req.params.playerid];

  res.send('Player ' + req.params.playerid + ' removed from game.\n')
});

// this will throw the ball (id is name of player, name is number of pins knocked down)
router.post('/lane/:laneid/player/:playerid/throw/:pins', function(req, res) {
  let selectedPlayer = laneTable[req.params.laneid].playerTable[req.params.playerid];
  throwBall(req.params.pins, selectedPlayer);
  updateTotalScore(selectedPlayer);
  // probably need to update players total score after the throw
  res.send('Player ' + req.params.playerid + ' knocked down ' + req.params.pins + ' pins!\n');
});

module.exports = router;
