'use strict';

// 管理用ルーム情報
const KEY_ADMIN_ROOMS  = 'admin_rooms';

const _ = require('lodash');


class Admin {

  constructor({ robot }) {
    this.brain = robot.brain;
  }

  brainGet() {
    return this.brain.get(KEY_ADMIN_ROOMS) || {};
  }

  brainSet({ rooms }) {
    if (!_.isObject({ rooms })) {
      throw new TypeError('brainSetAdminRooms');
      return;
    }

    this.brain.set(KEY_ADMIN_ROOMS, rooms);
    this.brain.save();
  }

  // (指定組織)
  loadOne({ domainId }) {
    if (!domainId) return false;

    const rooms = this.brainGet();
    return rooms[domainId];
  }

  loadRoomId({ domainId }) {
    const roomData = this.loadOne({ domainId });

    return _.get(roomData, 'room');
  }

  loadAction({ domainId }) {
    const roomData = this.loadOne({ domainId });

    return _.get(roomData, 'action');
  }

  // (全組織)
  loadAll() {
    return this.brainGet();
  }

  // 上書セーブ
  save({ domainId, roomData }) {
    if (!domainId) return false;

    const rooms = this.brainGet();
    rooms[domainId] = roomData;

    this.brainSet({ rooms });
  }

  saveRoomId({ domainId, roomId }) {
    if (!domainId) return false;

    const rooms    = this.brainGet();
    const roomData = Object.assign({}, rooms[domainId] || {}, { room: roomId });

    this.save({ domainId, roomData });
  }

  saveAction({ domainId, action }) {
    if (!domainId) return false;

    const rooms    = this.brainGet();
    const roomData = Object.assign({}, rooms[domainId] || {}, { action });

    this.save({ domainId, roomData });
  }

  // 組織情報を初期化
  domainInit({ domainId }) {
    this.save({ domainId, roomData: { room: false, action: false } });
  }
}

module.exports = Admin;
