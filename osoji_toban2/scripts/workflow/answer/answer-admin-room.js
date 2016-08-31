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
    this.model.redis.admin.saveRoomId({ domainId, roomId });

    // 管理ルーム設定のメッセージ
    this.workflow.send.setAdminRoom({ roomId });
    this.workflow.question.whatDo({ roomId });
  }

  // このトークルームを管理ルームから解除する
  unset({ res }) {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // Redisにセーブ
    this.model.redis.admin.domainInit({ domainId });

    // 管理ルーム解除のメッセージ
    this.workflow.send.unsetAdminRoom({ roomId });
    this.workflow.send.questionSetAdminRoom({ roomId });
  }


}

module.exports = AdminRoom;
