'use strict';

const _    = require('lodash');
const util = require('../../util');


// 終了時刻(Hour)の登録
const editEndHour = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // 入力文字列を改行区切り・トリム・空行除外
    const hour = msg.split('\n').map(_.trim).filter(m => m);

    const hourNum = Number(_.head(hour));

    // 1行の入力でない場合
    if (hour.length !== 1) {
      workflow.message.notAllowManyInput({ roomId });
      return;
    }

    // 数値でない場合
    if (!hourNum && (hourNum !== 0)) {
      workflow.message.notAllowStringAllowNumeric({ roomId });
      return;
    }


    // 終了時を上書登録
    model.timers.saveItems({ domainId, end_hour: hourNum });

    // アクション設定
    model.admin.saveAction({ domainId, action: 'SETTING' });

    // 設定メッセージ送信
    workflow.question.whatSetting({ roomId });
  };

}

module.exports = editEndHour;
