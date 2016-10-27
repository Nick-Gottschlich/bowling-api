var express = require('express');
var frame = require('./frame.js')

// player has 10 frames, and a totalscore, and a counter for throw and frame
class player {
	constructor() {
    this.frame = [];

    this.currentFrame = 0;
    this.currentThrow = 0;

	  for (let i = 0; i <= 9; i++) {
      this.frame[i] = new frame(i);
    }

    this.totalScore = 0;
	}
}

module.exports = player;
