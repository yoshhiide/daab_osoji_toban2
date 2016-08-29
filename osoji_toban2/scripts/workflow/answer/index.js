'use strict';

const ConfirmMember = require('./confirm-member');
const AdminRoom     = require('./check-admin-room');


class Answer {

  constructor(args) {
    this.confirmMember = ConfirmMember(args);
    this.adminRoom     = new AdminRoom(args);
  }

}

module.exports = Answer;
