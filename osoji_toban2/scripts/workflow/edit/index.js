'use strict';

const Choose       = require('./edit-choose');
const Member       = require('./edit-member');
const Week         = require('./edit-week');
const StartMessage = require('./edit-start-message');
const StartHour    = require('./edit-start-hour');
const StartMinute  = require('./edit-start-minute');
const EndMessage   = require('./edit-end-message');
const EndHour      = require('./edit-end-hour');
const EndMinute    = require('./edit-end-minute');


class WorkflowEdit {

  constructor(args) {
    this.choose       = Choose(args);
    this.member       = Member(args);
    this.week         = Week(args);
    this.startMessage = StartMessage(args);
    this.startHour    = StartHour(args);
    this.startMinute  = StartMinute(args);
    this.endMessage   = EndMessage(args);
    this.endHour      = EndHour(args);
    this.endMinute    = EndMinute(args);
  }

}

module.exports = WorkflowEdit;
