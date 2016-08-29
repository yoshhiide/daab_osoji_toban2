'use strict';

// 通知タイマー情報
const KEY_TIMERS = 'timers';

const _ = require('lodash');


class RedisTimers {

  constructor({ robot }) {
    this.brain = robot.brain;
  }

  brainGet() {
    return this.brain.get(KEY_TIMERS) || {};
  }

  brainSet({ timers }) {
    if (!_.isObject(timers)) {
      throw new TypeError('timers.brainSet');
      return;
    }

    this.brain.set(KEY_TIMERS, timers);
    this.brain.save();
  }

}

module.exports = RedisTimers;
