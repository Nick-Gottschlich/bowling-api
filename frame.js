var express = require('express');
//frame has a playerID,

class frame {
  constructor(frameID) {
    if (frameID === 10) {
      this.test = "10th frame";
    }
    else {
      this.test = "not 10th frame";
    }
  }
}

// let frame = "hi";

module.exports = frame;
