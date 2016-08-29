'use strict';

const Redis = require('./redis');


class Model {

  constructor(args) {
    this.redis = Redis(args);
  }

}

module.exports = Model;
