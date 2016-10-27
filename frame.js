var express = require('express');
//each frame has an ID (1-10), and two throws (except for the last frame which has the possibility of 3.
//a strike would looks like [10, 0]

function throw() {

}

class frame {
  constructor(frameID) {
    this.throws = [];
    this.score = [];
  }
}

// let frame = "hi";

module.exports = frame;
