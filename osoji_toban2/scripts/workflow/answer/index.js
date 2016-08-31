'use strict';

const ConfirmMember = require('./answer-confirm-member');
const SetAdminRoom  = require('./answer-set-admin-room');


class WorkflowAnswer {

  constructor(args) {
    this.confirmMember = ConfirmMember(args);
    this.setAdminRoom  = new SetAdminRoom(args);
  }

}

module.exports = WorkflowAnswer;
