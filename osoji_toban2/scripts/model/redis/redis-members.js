'use strict';

// 登録したメンバー名
const KEY_ALL_MEMBERS = 'all_members';

const _ = require('lodash');


class RedisMembers {

  constructor({ robot }) {
    this.brain = robot.brain;
  }

  brainGet() {
    return this.brain.get(KEY_ALL_MEMBERS) || {};
  }

  brainSet({ members }) {
    if (!_.isObject(members)) {
      throw new TypeError('members.brainSet');
      return;
    }

    this.brain.set(KEY_ALL_MEMBERS, members);
    this.brain.save();
  }

  // (指定組織)
  loadOne(domainId) {
    if (!domainId) return false;

    const allMembers = this.brainGet();
    return allMembers[domainId] || [];
  }

  // メンバー上書き登録
  save({ domainId, members }) {
    if (!domainId || !_.isArray(members)) return false;

    const allMembers = this.brainGet();
    allMembers[domainId] = members;

    this.brainSet({ members: allMembers });
  }
}

module.exports = RedisMembers;
