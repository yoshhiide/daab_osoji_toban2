const _ = require('lodash');

const util  = require('../util');
const Redis = require('../redis');

// このトークルームが管理ルームであるか判定(true/false)
class checkAdminRoom {

  constructor(robot) {
    this.robot = robot;
    const redis = new Redis(robot);

    return (res) => {

      const roomId = util.res.getRoomId(res);

      // この組織のID
      const domainId = util.res.getDomainId(res);

      // この組織の管理ルームID
      const adminRoomId = redis.admin.loadOne(domainId);

      return (adminRoomId === roomId);
    };
  }
}

module.exports = checkAdminRoom;
