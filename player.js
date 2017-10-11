var express = require('express');
var frame = require('./frame.js');

// player has 10 frames, and a totalscore, and a counter for throw and frame
class player {
	constructor() {
    this.currentFrame = 0;
    this.currentThrow = 0;

    this.frame = [];

	  for (let i = 0; i <= 9; i++) {
      this.frame[i] = new frame(i);
    }

    this.totalScore = [];

    for (let i = 0; i <= 9; i++) {
      this.totalScore[i] = 0;
    }
	}
}

module.exports = player;
