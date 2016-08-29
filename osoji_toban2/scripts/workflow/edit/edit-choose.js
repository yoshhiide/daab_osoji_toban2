'use strict';

const _    = require('lodash');
const util = require('../../util');


// 担当選出数の登録
const editChoose = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // 入力文字列を改行区切り・トリム・空行除外
    const choose = msg.split('\n').map(_.trim).filter(m => m);

    const chooseNum = Number(_.head(choose));

    // 1行の入力でない場合
    if (choose.length !== 1) {
      workflow.send.notAllowManyInput({ roomId });
      return;
    }

    // 数値でない場合
    if (!chooseNum && (chooseNum !== 0)) {
      workflow.send.notAllowStringAllowNumeric({ roomId });
      return;
    }

    // 担当者選出数を上書登録
    model.redis.timers.saveChoose({ domainId, choose: chooseNum });
  };

}

module.exports = editChoose;
