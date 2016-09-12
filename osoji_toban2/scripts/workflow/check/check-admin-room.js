'use strict';

const _    = require('lodash');
const util = require('../../util');


// このトークルームが管理ルームであるか判定(true/false)
const checkAdminRoom = ({ model }) => {

  return ({ res }) => {
    const roomId = util.res.getRoomId({ res });

    // この組織のID
    const domainId = util.res.getDomainId({ res });

    // この組織の管理ルームID
    const adminRoom   = model.admin.loadOne({ domainId });
    const adminRoomId = _.get(adminRoom, 'room');

    return (adminRoomId === roomId);
  };

}

module.exports = checkAdminRoom;
