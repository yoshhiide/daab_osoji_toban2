'use strict';

const EditChoose       = require('./edit-choose');
const EditMember       = require('./edit-member');
const EditStartMessage = require('./edit-start-message');
const EditStartHour    = require('./edit-start-hour');
const EditStartMinute  = require('./edit-start-minute');
const EditEndMessage   = require('./edit-end-message');
const EditEndHour      = require('./edit-end-hour');
const EditEndMinute    = require('./edit-end-minute');


class WorkflowEdit {

  constructor(args) {
    this.choose       = EditChoose(args);
    this.member       = EditMember(args);
    this.startMessage = EditStartMessage(args);
    this.startHour    = EditStartHour(args);
    this.startMinute  = EditStartMinute(args);
    this.endMessage   = EditEndMessage(args);
    this.endHour      = EditEndHour(args);
    this.endMinute    = EditEndMinute(args);
  }

}

module.exports = WorkflowEdit;
