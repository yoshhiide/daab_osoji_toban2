'use strict';

const util = require('../../util');


class AdminRoom {

  constructor({ act, model, workflow }) {
    this.act      = act;
    this.model    = model;
    this.workflow = workflow;
  }

  // このトークルームを管理ルームに設定する
  set({ res }) {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // Redisにセーブ
    this.model.admin.saveRoomId({ domainId, roomId });

    // 管理ルーム設定のメッセージ
    this.workflow.message.setAdminRoom({ roomId });
    this.workflow.question.whatDo({ roomId });
  }

  // このトークルームを管理ルームから解除する
  unset({ res }) {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // Redisにセーブ
    this.model.admin.domainInit({ domainId });

    // 管理ルーム解除のメッセージ
    this.workflow.message.unsetAdminRoom({ roomId });
    this.workflow.question.setAdminRoom({ roomId });
  }


}

module.exports = AdminRoom;
