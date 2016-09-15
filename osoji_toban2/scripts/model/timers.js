'use strict';

// 通知タイマー情報
const KEY_TIMERS = 'timers';

const _ = require('lodash');


class Timers {

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

  // 上書セーブ
  save({ domainId, timer }) {
    if (!domainId) return false;

    const timers = this.brainGet();
    timers[domainId] = timer;

    this.brainSet({ timers });
  }

  saveItems({ domainId, choose, member, week, start_message, start_hour, start_minute, end_message, end_hour, end_minute }) {
    if (!domainId) return false;

    // undefinedは除外
    const saveItems = [
      { choose },
      { member },
      { week },
      { start_message },
      { start_hour },
      { start_minute },
      { end_message },
      { end_hour },
      { end_minute }
    ].filter(item => !_.isUndefined(_.head(_.values(item))));

    const timers = this.brainGet();
    const timer  = Object.assign({}, timers[domainId] || {}, ...saveItems);
    //const timer    = Object.assign({}, timers, { [domainId]: mergeObj });

    this.save({ domainId, timer });
  }

  // (指定組織)
  loadOne({ domainId }) {
    if (!domainId) return false;

    const allTimers = this.brainGet();
    return allTimers[domainId] || [];
  }

  // (全組織)
  loadAll() {
    return this.brainGet();
  }


}

module.exports = Timers;
