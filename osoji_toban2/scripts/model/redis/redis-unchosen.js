'use strict';

// 選出未済メンバー名
const KEY_UNCHOSEN = 'unchosen';

const _ = require('lodash');


class RedisUnchosen {

  constructor({ robot }) {
    this.brain = robot.brain;
  }

  brainGet() {
    return this.brain.get(KEY_UNCHOSEN) || {};
  }

  brainSet({ members }) {
    if (!_.isObject(members)) {
      throw new TypeError('unchosen.brainSet');
      return;
    }

    this.brain.set(KEY_UNCHOSEN, members);
    this.brain.save();
  }

}

module.exports = RedisUnchosen;