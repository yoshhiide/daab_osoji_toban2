'use strict';

const util = require('../../util');


// メッセージ設定
const editStartMessage = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });

    // メッセージを上書登録
    model.redis.timers.saveItems({ domainId, start_message: msg });
  };

};

module.exports = editStartMessage;
