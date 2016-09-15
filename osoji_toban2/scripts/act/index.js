'use strict';

const SendFunc = require('./send-func');
const Brains   = require('./brains');


class Act {

  constructor(args) {
    this.sendFunc = SendFunc(args);
    this.brains   = new Brains(args);
  }

}

module.exports = Act;
