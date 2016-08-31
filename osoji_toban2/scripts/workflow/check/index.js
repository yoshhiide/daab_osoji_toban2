'use strict';

const AdminRoom = require('./check-admin-room');

class WorkflowCheck {

  constructor(args) {
    this.adminRoom = AdminRoom(args);
  }

}

module.exports = WorkflowCheck;
