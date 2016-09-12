'use strict';

const util = require('../../util');


// メッセージ設定
const editEndMessage = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });

    // メッセージを上書登録
    model.timers.saveItems({ domainId, end_message: msg });

    // アクション設定
    model.admin.saveAction({ domainId, action: 'SETTING' });

    // 設定メッセージ送信
    workflow.question.whatSetting({ roomId });
  };

};

module.exports = editEndMessage;
