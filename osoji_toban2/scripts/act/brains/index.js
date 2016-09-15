'use strict';

const Rooms = require('./brains-rooms');


class ActBrains {

  constructor(args) {
    this.rooms = new Rooms(args);
  }

}

module.exports = ActBrains;
