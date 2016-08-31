'use strict';

const Redis = require('./redis');


class Model {

  constructor(args) {
    this.redis = new Redis(args);
  }

}

module.exports = Model;
