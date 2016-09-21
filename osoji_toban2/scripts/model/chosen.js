'use strict';

// 選出未済メンバー名
const KEY_CHOSEN = 'chosen_members';

const _ = require('lodash');


class Chosen {

  constructor({ robot }) {
    this.brain = robot.brain;
  }

  brainGet() {
    return this.brain.get(KEY_CHOSEN) || {};
  }

  brainSet({ members }) {
    if (!_.isObject(members)) {
      throw new TypeError('chosen.brainSet');
      return;
    }

    this.brain.set(KEY_CHOSEN, members);
    this.brain.save();
  }

  // (全組織)
  loadAll() {
    return this.brainGet();
  }

  // メンバー上書き登録
  save({ domainId, chosen }) {
    if (!domainId || !_.isArray(chosen)) return false;

    const chosenMembers = this.brainGet();
    chosenMembers[domainId] = chosen;

    this.brainSet({ members: chosenMembers });
  }
}

module.exports = Chosen;
