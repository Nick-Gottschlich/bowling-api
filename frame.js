var express = require('express');

// frame can have up to 3 throws (only the last frame can have 3 throws)
class frame {
  constructor(frameID) {
    this.throws = [];
    this.score = 0;
  }
}

// let frame = "hi";

module.exports = frame;
