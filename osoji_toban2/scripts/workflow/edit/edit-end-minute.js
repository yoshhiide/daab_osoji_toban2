'use strict';

const _    = require('lodash');
const util = require('../../util');


// 終了時刻(Minute)の登録
const editEndMinute = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // 入力文字列を改行区切り・トリム・空行除外
    const minute = msg.split('\n').map(_.trim).filter(m => m);

    const minuteNum = Number(_.head(minute));

    // 1行の入力でない場合
    if (minute.length !== 1) {
      workflow.message.notAllowManyInput({ roomId });
      return;
    }

    // 数値でない場合
    if (!minuteNum && (minuteNum !== 0)) {
      workflow.message.notAllowStringAllowNumeric({ roomId });
      return;
    }


    // 終了分を上書登録
    model.timers.saveItems({ domainId, end_minute: minuteNum });

    // アクション設定
    model.admin.saveAction({ domainId, action: 'SETTING' });

    // 設定メッセージ送信
    workflow.question.whatSetting({ roomId });
  };

}

module.exports = editEndMinute;
