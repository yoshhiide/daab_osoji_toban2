'use strict';

// 管理用ルーム情報
const KEY_ADMIN_ROOMS  = 'admin_rooms';

const _ = require('lodash');


class RedisAdmin {

  constructor(robot) {
    this.brain = robot.brain;
  }

  brainGet() {
    return this.brain.get(KEY_ADMIN_ROOMS) || {};
  }

  brainSet(rooms) {
    if (!_.isObject(rooms)) {
      throw new TypeError('brainSetAdminRooms');
      return;
    }

    this.brain.set(KEY_ADMIN_ROOMS, rooms);
    this.brain.save();
  }

  // (指定組織)
  loadOne(domainId) {
    if (!domainId) return false;

    const rooms = this.brainGet();
    return rooms[domainId];
  }

  // (全組織)
  loadAll() {
    return this.brainGet();
  }

  save({domainId, room}) {
    if (!domainId) return false;

    const rooms = this.brainGet();
    rooms[domainId] = room;

    this.brainSet(rooms);
  }
}

module.exports = RedisAdmin;
