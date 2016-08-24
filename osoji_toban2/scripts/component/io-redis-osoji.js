'use strict';

const KEY_ADMIN_ROOM  = 'admin_room_id';// 管理用ルームID
const KEY_ALL_MEMBERS = 'all_members';  // 登録したメンバー名
const KEY_UNCHOSEN    = 'unchosen';     // 選出未済メンバー名

const _ = require('lodash');


class IORedisOsoji {
  constructor(brain) {
    this.brain = brain;
  }

  // Redisから指定キーで取得
  // 管理用ルームID
  brainGetAllAdminRoomIds() {
    return this.brain.get(KEY_ADMIN_ROOM) || {};
  }

  // 登録メンバー名
  brainGetAllMembers() {
    return this.brain.get(KEY_ALL_MEMBERS) || {};
  }

  // 選出未済メンバー名
  brainGetUnchosen() {
    return this.brain.get(KEY_UNCHOSEN) || {};
  }

  // Redisに指定キーで保存
  // 管理用ルームID
  brainSetAdminRoomId(roomIds) {
    if (!_.isObject(roomIds)) {
      throw new TypeError('brainSetAdminRoomId');
      return;
    }

    this.brain.set(KEY_ADMIN_ROOM, roomIds);
  }

  // 登録メンバー名
  brainSetAllMembers(members) {
    if (!_.isObject(members)) {
      throw new TypeError('brainSetAllMembers');
      return;
    }

    this.brain.set(KEY_ALL_MEMBERS, members);
  }


  // 管理ルームID(指定組織)
  getAdminRoomId(domainId) {
    if (!domainId) return false;

    const roomIds = this.brainGetAllAdminRoomIds();
    return roomIds[domainId];
  }

  // 管理ルームID(全組織)
  getAdminRoomIds() {
    return this.brainGetAllAdminRoomIds();
  }

  // 管理ルームID保存
  setAdminRoomId({domainId, roomId}) {
    if (!domainId) return false;

    const roomIds = this.brainGetAllAdminRoomIds();
    roomIds[domainId] = roomId;

    this.brainSetAdminRoomId(roomIds);
  }

  // 登録メンバー名
  getMembers(domainId) {
    if (!domainId) return false;

    const allMembers = this.brainGetAllMembers();
    return allMembers[domainId] || [];
  }

  // メンバー上書き登録
  setMembers({domainId, members}) {
    if (!domainId || !_.isArray(members)) return false;

    const allMembers = this.brainGetAllMembers();
    allMembers[domainId] = members;

    this.brainSetAllMembers(allMembers);
  }
}

module.exports = IORedisOsoji;
