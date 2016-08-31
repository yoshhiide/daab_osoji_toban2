'use strict';

const ConfirmMember = require('./answer-confirm-member');
const AdminRoom     = require('./answer-admin-room');


class WorkflowAnswer {

  constructor(args) {
    this.confirmMember = ConfirmMember(args);
    this.adminRoom     = new AdminRoom(args);
  }

}

module.exports = WorkflowAnswer;
