'use strict';

const UtilRes      = require('./util-res');
const utilHearText = require('./util-hear-text');


class Util {

  constructor() {
    this.res      = new UtilRes();
    this.hearText = utilHearText;
  }

}

module.exports = new Util();
