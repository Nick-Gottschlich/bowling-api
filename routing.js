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
  currentPlayer.frame[currentPlayer.currentFrame].throws[currentPlayer.currentThrow] = pins;

  // strike!
  if (pins == 10 && currentPlayer.currentThrow == 0) {
    currentPlayer.frame[currentPlayer.currentFrame].strike = true;

    //increment currentThrow - since we skip the second throw, we will act as if this was the second throw, unless this is the last frame
    if (currentPlayer.currentFrame < 9) {
      currentPlayer.currentThrow++;
    }
  }
  // spare!
  // checks to see if this is the second throw, and if the first throw plus this throw's pins equals 10
  else if (currentPlayer.currentThrow == 1 && (parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[0]) + parseInt(pins) == 10)) {
    currentPlayer.frame[currentPlayer.currentFrame].spare = true;
  }

  //if we're on the last frame, we need to add up all 3 throws
  if (currentPlayer.currentFrame == 9) {
    currentPlayer.frame[currentPlayer.currentFrame].score = parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[0]) + parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[1]) + parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[2]);
  }
  else {
    currentPlayer.frame[currentPlayer.currentFrame].score = parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[0]) + parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[1]);
  }

  //case where last 2 frames are strikes
  if (currentPlayer.currentFrame > 1) {
    if (currentPlayer.frame[currentPlayer.currentFrame - 1].strike && currentPlayer.frame[currentPlayer.currentFrame - 2].strike) {
      //if this throw is a strike, two frames back gets +10, and the runningTotal of one frame back gets +10
      if (currentPlayer.frame[currentPlayer.currentFrame].strike && ((currentPlayer.currentFrame == 9 && currentPlayer.currentThrow == 0) || (currentPlayer.currentFrame < 9 && currentPlayer.currentThrow == 1))) {
        currentPlayer.frame[currentPlayer.currentFrame - 2].score += parseInt(10);
        currentPlayer.totalScore[currentPlayer.currentFrame - 2] += parseInt(10);

        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(10);
      }
      //else if this is the first throw we add it to two frames back, and we add it to the running total one back
      else if (currentPlayer.currentThrow == 0 && currentPlayer.currentFrame < 9) {
        currentPlayer.frame[currentPlayer.currentFrame - 2].score += parseInt(currentPlayer.frame[currentPlayer.currentFrame].score);
        currentPlayer.totalScore[currentPlayer.currentFrame - 2] += parseInt(currentPlayer.frame[currentPlayer.currentFrame].score);

        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(currentPlayer.frame[currentPlayer.currentFrame].score);
      }
    }
  }

  //case where last frame was strike
  if (currentPlayer.currentFrame > 0) {
    if (currentPlayer.frame[currentPlayer.currentFrame - 1].strike) {
      //if we hit a strike (we will be guaranteed to be on second throw in this case), previous frame gets +10
      if (currentPlayer.frame[currentPlayer.currentFrame].strike && ((currentPlayer.currentFrame == 9 && currentPlayer.currentThrow == 0 || currentPlayer.currentFrame < 9 && currentPlayer.currentThrow == 1))) {
        currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(10);
        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(10);
      }
      //else if we are on the second throw, add the score of this frame to the previous frame
      else if (currentPlayer.currentThrow == 1 && currentPlayer.currentFrame < 9) {
        currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(currentPlayer.frame[currentPlayer.currentFrame].score);
        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(currentPlayer.frame[currentPlayer.currentFrame].score);
      }
      else if (currentPlayer.currentThrow == 1 && currentPlayer.currentFrame == 9) {
        currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[1]);
        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(currentPlayer.frame[currentPlayer.currentFrame].throws[1]);
      }
    }
  }

  // case where last frame was spare
  if (currentPlayer.currentFrame > 0) {
    if (currentPlayer.frame[currentPlayer.currentFrame - 1].spare) {
      //if we hit a strike, previous frame gets +10
      if (currentPlayer.frame[currentPlayer.currentFrame].strike) {
        currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(10);
        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(10);
      }
      //else if we are on the first throw, add the score of this frame to the previous frame
      else if (currentPlayer.currentThrow == 0) {
        currentPlayer.frame[currentPlayer.currentFrame - 1].score += parseInt(pins);
        currentPlayer.totalScore[currentPlayer.currentFrame - 1] += parseInt(pins);
      }
    }
  }

  //update the runningTotal
  let hold = 0;
  for (let i = 0; i <= currentPlayer.currentFrame; i++) {
    hold += parseInt(currentPlayer.frame[i].score);
  }
  currentPlayer.totalScore[currentPlayer.currentFrame] = hold;


  if (currentPlayer.currentThrow == 1) {
    if (currentPlayer.currentFrame == 9 && (currentPlayer.frame[9].strike || currentPlayer.frame[9].spare)) {
      currentPlayer.currentThrow++;
    }
    else {
      currentPlayer.currentFrame++;
      currentPlayer.currentThrow = 0;
    }
  }
  else {
    currentPlayer.currentThrow++;
  }
}

// building an ASCII scorecard to show to when GET is called on a specific player in a specific game
function buildScoreCard(player) {
  let curFrameText = 'Current Frame: ' + parseInt(player.currentFrame + 1) + '\n';
  let curThrowText = 'Current Throw: ' + parseInt(player.currentThrow + 1) + '\n';

  let line =       ' -----------------------------------------------------------------------------' + '\n';
  let frameText =  '| Frames        |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10   |' + '\n';

  let resultText = '| Result        |';
  // we should output X or / for strike or spare
  for (let i = 0; i < 9; i++) {
    if (player.frame[i].strike) {
      resultText += ' X 0 |';
    }
    else if (player.frame[i].spare) {
      resultText += ' ' + player.frame[i].throws[0] + ' / |';
    }
    else {
      resultText += ' ' + player.frame[i].throws[0] + ' ' + player.frame[i].throws[1] + ' |';
    }
  }
  //last frame
  //case where first throws is strike
  if (player.frame[9].throws[0] == 10) {
    //second throws is strike
    if (player.frame[9].throws[1] == 10) {
      //third throws is strike
      if (player.frame[9].throws[2] == 10) {
        resultText += ' X X X |' + '\n';
      }
      //else third throw we just print number of pins
      else {
        resultText += ' X X ' + player.frame[9].throws[2] + ' |' + '\n';
      }
    }
    //else if we hit 0 on second and 10 on third
    else if (player.frame[9].throws[1] == 0 && player.frame[9].throws[2] == 10) {
      resultText += ' X 0 X |' + '\n';
    }
    //else we just print second and third number
    else {
      resultText += ' X ' + player.frame[9].throws[1] + ' ' + player.frame[9].throws[2] + ' |' + '\n';
    }
  }
  //case where second throws is a spare
  else if (parseInt(player.frame[9].throws[0]) + parseInt(player.frame[9].throws[1]) == parseInt(10)) {
    //case where we hit a strike on throw 3
    if (player.frame[9].throws[2] == 10) {
      resultText += ' ' + player.frame[9].throws[0] + ' / X |' + '\n';
    }
    else {
      resultText += ' ' + player.frame[9].throws[0] + ' / ' + player.frame[9].throws[2] + ' |' + '\n';
    }
  }
  else {
    resultText += ' ' + player.frame[9].throws[0] + ' ' + player.frame[9].throws[1] + ' ' + player.frame[9].throws[2] + ' |' + '\n';
  }

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

  runningTotalText = '| Running Total |';
  for (let i = 0; i < 9; i++) {
    if (player.totalScore[i] >= 100) {
      runningTotalText += ' ' + player.totalScore[i] + ' |';
    }
    else if (player.totalScore[i] >= 10) {
      runningTotalText += ' ' + player.totalScore[i] + '  |';
    }
    else {
      runningTotalText += '  ' +  player.totalScore[i] + '  |';
    }
  }
  if (player.totalScore[9] >= 100) {
    runningTotalText += '  ' + player.totalScore[9] + '   |' + '\n';
  }
  else if (player.totalScore[9] >= 10) {
    runningTotalText += '  ' + player.totalScore[9] + '    |' + '\n';
  }
  else {
    runningTotalText += '   ' +  player.totalScore[9] + '   |' + '\n';
  }

  bigstring = curFrameText + curThrowText + line + frameText + line + resultText + line + frameScoreText + line + runningTotalText + line;

  return bigstring;
}

//displays all active lanes
router.get('/lane', function(req,res) {
  let laneString = 'Active Lanes: \n';
  for (var key in laneTable) {
    laneString += key + '\n';
  }

  res.send(laneString);
});

//creates a new lane, ex: /lane creates a lane with key '0'
router.post('/lane/', function(req,res) {
  laneTable[laneCount] = new lane();
  thisLane = laneCount;
  laneCount++;

  res.send('You began a game in lane: ' + thisLane + '\n');
});

//get a list of players in the game
router.get('/lane/:laneid/player', function (req,res) {
  let playerString = 'Players: \n';
  for (var key in laneTable[req.params.laneid].playerTable) {
    playerString += key + '\n';
  }

  res.send(playerString);
});

//get the score card of a player
router.get('/lane/:laneid/player/:playerid', function(req, res) {
  res.send(buildScoreCard(laneTable[req.params.laneid].playerTable[req.params.playerid]));
});

// creates a new player, ex: /player/Steve creates a player (key for player will be 'Steve') (case sensitive!)
router.post('/lane/:laneid/player/:playerid', function(req, res){
  laneTable[req.params.laneid].playerTable[req.params.playerid] = new player();

  res.send('Player ' + req.params.playerid + ' added to game.\n');
});

// remove a player from the game by ID
router.delete('/lane/:laneid/player/:playerid', function(req,res) {
  delete laneTable[req.params.laneid].playerTable[req.params.playerid];

  res.send('Player ' + req.params.playerid + ' removed from game.\n')
});

// this will throw the ball
router.post('/lane/:laneid/player/:playerid/throw/:pins', function(req, res) {
  let selectedPlayer = laneTable[req.params.laneid].playerTable[req.params.playerid];

  throwBall(req.params.pins, selectedPlayer);

  res.send('Player ' + req.params.playerid + ' knocked down ' + req.params.pins + ' pins!\n');
});

module.exports = router;
