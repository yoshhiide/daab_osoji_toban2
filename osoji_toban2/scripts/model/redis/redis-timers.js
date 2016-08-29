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

  // 上書セーブ
  save({ domainId, timer }) {
    if (!domainId) return false;

    const timers = this.brainGet();
    timers[domainId] = timer;

    this.brainSet({ timers });
  }

  saveChoose({ domainId, choose }) {
    if (!domainId) return false;

    const timers   = this.brainGet();
    const mergeObj = Object.assign({}, timers[domainId] || {}, { choose });
    const timer    = Object.assign({}, timers, { [domainId]: mergeObj });

    this.brainSet({ timer });
  }

  /*
  saveAction({ domainId, action }) {
    if (!domainId) return false;

    const rooms    = this.brainGet();
    const mergeObj = Object.assign({}, rooms[domainId] || {}, { action });
    const room     = Object.assign({}, rooms, { [domainId]: mergeObj });

    this.brainSet({ rooms });
  }

  // 組織情報を初期化
  domainInit({ domainId }) {
    this.save(domainId, { room: false, action: false });
  }
  */
}

module.exports = RedisTimers;
