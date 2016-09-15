'use strict';

/*
 * new BrainRooms(robot)で入退室イベント時にrobot.brain.rooms()を実行する
 * brainRooms.roomsInfo で最新のrobot.brain.rooms()の情報を取得する
 */

class BrainsRooms {

  constructor({ robot }) {
    this.robot = robot;
    this.bulkEvent = true;

    // robot.brain.roomsの初回取得
    this.robotBrainRooms = {};
    this.setRooms(0);

    // 入退室イベント登録
    this.robotEvent();
  }

  get info() {
    return this.robotBrainRooms;
  }

  get nowInfo() {
    this.setRooms(0)
    return this.robotBrainRooms;
  }

  robotEvent() {
    this.robot.enter(res => this.setRooms());
    this.robot.leave(res => this.setRooms());
    this.robot.join(res  => this.setRooms());
  }

  setRooms(timeout = 1500) {
    // 同期実行
    if (timeout === 0) {
      this.robotBrainRooms = this.robot.brain.rooms();
      return;
    }

    // enterの場合など、複数人が一括してルームに参加することがある為、
    // setTimeout間に1回だけ実行する
    if (this.bulkEvent) {
      bulkEvent = false;
      setTimeout(() => {
        this.robotBrainRooms = this.robot.brain.rooms();
        bulkEvent = true;
      }, timeout);
    }
  }

}

module.exports = BrainsRooms;
