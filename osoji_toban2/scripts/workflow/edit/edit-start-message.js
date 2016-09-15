'use strict';

const util = require('../../util');


// メッセージ設定
const editStartMessage = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // メッセージを上書登録
    model.timers.saveItems({ domainId, start_message: msg });

    // 現在の設定情報をメッセージ送信
    workflow.message.settingInfo({ domainId, roomId });

    // アクション設定
    model.admin.saveAction({ domainId, action: 'SETTING' });

    // 設定メッセージ送信
    workflow.question.whatSetting({ roomId });
  };

};

module.exports = editStartMessage;
