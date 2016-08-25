'use strict';

const Edit = require('./members-edit');

class Members {

  constructor(robot) {
    this.edit = new Edit(robot);
  }

}

module.exports = Members;
