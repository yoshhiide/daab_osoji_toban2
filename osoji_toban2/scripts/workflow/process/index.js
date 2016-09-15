'use strict';

const CronSet             = require('./process-cron-set');
const CronAlert           = require('./process-cron-alert');
const UpdateChooseMembers = require('./process-update-choose-members');


class WorkflowProcess {

  constructor(args) {
    this.cronSet             = CronSet(args);
    this.cronAlert           = CronAlert(args);
    this.updateChooseMembers = UpdateChooseMembers(args);
  }

}

module.exports = WorkflowProcess;
