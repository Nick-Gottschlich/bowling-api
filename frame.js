var express = require('express');

// frame can have up to 3 throws (only the last frame can have 3 throws)
class frame {
  constructor(frameID) {
    this.throws = [parseInt(0), parseInt(0)];
    this.score = parseInt(0);
    // these will be easier to check when going "back in time" to update scores of previous frames
    this.strike = false;
    this.spare = false;
  }
}

// let frame = "hi";

module.exports = frame;
