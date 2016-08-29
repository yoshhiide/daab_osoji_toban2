'use strict';

const EditChoose  = require('./edit-choose');
const EditMember  = require('./edit-member');
const EditMessage = require('./edit-message');
const EditTime    = require('./edit-time');


class Edit {

  constructor(args) {
    this.member  = EditMember(args);
    this.choose  = EditChoose(args);
    this.time    = EditTime(args);
    this.message = EditMessage(args);
  }

}

module.exports = Edit;
