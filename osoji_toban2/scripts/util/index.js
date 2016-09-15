'use strict';

const UtilRes          = require('./util-res');
const utilHearText     = require('./util-hear-text');
const utilNumToWeek    = require('./util-num-to-week');
const utilWeekToNum    = require('./util-week-to-num');
const utilMinuteFormat = require('./util-minute-format');


class Util {

  constructor() {
    this.res          = new UtilRes();
    this.hearText     = utilHearText;
    this.numToWeek    = utilNumToWeek;
    this.weekToNum    = utilWeekToNum;
    this.minuteFormat = utilMinuteFormat;
  }

}

module.exports = new Util();
