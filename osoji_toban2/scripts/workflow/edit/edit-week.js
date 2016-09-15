'use strict';

const _    = require('lodash');
const util = require('../../util');


// 曜日(Week)の登録
const editWeek = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // 入力文字列を改行区切り・トリム・空行除外
    const week = msg.split('\n').map(_.trim).filter(m => m);

    // 1行の入力でない場合
    if (week.length !== 1) {
      workflow.message.notAllowManyInput({ roomId });
      return;
    }

    // 一文字ずつ配列へ
    const weekArr = _.head(week).split('');

    // 曜日変換
    const weekNum = util.weekToNum(_.head(weekArr));

    // 曜日が入力されていなかった場合
    if (!weekNum && (weekNum !== 0)) {
      workflow.message.notAllowNotWeek({ roomId });
      return;
    }


    // 曜日を上書登録
    model.timers.saveItems({ domainId, week: weekNum });

    // 現在の設定情報をメッセージ送信
    workflow.message.settingInfo({ domainId, roomId });

    // アクション設定
    model.admin.saveAction({ domainId, action: 'SETTING' });

    // 設定メッセージ送信
    workflow.question.whatSetting({ roomId });
  };

}

module.exports = editWeek;
