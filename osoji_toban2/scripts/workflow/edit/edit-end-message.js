'use strict';

const util = require('../../util');


// メッセージ設定
const editEndMessage = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });

    // メッセージを上書登録
    model.redis.timers.saveItems({ domainId, end_message: msg });
  };

};

module.exports = editEndMessage;
