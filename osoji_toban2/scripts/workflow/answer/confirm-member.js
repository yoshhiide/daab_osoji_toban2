'use strict';

const util = require('../../util');


const confirmMember = ({ act, model, workflow }) => ({ res }) => {

  const domainId = util.res.getDomainId({ res });
  const roomId   = util.res.getRoomId({ res });

  // Redisからこの組織の登録メンバー取得
  const members = model.redis.members.loadRoomId({ domainId });

  if (members.length === 0) {
    act.sendFunc({ roomId, text: '登録メンバーはいませんでした。' });
    workflow.question.whatDo({ roomId });
  } else {
    // 登録メンバー名をメッセージ送信
    act.sendFunc({ roomId, text: members.join('\n') });
    workflow.question.whatDo({ roomId });
  }

}

module.exports = SetAdminRoom;
