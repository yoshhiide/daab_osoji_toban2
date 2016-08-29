'use strict';

const AdminRoom = require('./check-admin-room');

class Check {

  constructor(robot) {
    this.adminRoom = new AdminRoom(robot);
  }

}

module.exports = Check;
