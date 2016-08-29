'use strict';

const SendFunc = require('./send-func');


class Act {

  constructor(args) {
    this.sendFunc = SendFunc(args);
  }

}

module.exports = Act;
