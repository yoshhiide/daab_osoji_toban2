'use strict';

const _ = require('lodash');


const hearText = ({ res }) => {
  let msg = _.get(res, 'match[1]');

  if (!msg) return false;

  // ペアトークの場合
  if (res.message.roomType === 1) {
    msg = msg.replace(/^\S+ /, '');
  }

  if (/^\{[\s\S]+\}$/.test(msg)) return false;

  // トークルーム名の変更を対象外に
  if (_.isNull(res.message.id)) return false;

  /*
  // スタンプ、セレクトスタンプのバリデーション
  if (((msg.includes('stamp_set')) &&
       (msg.includes('stamp_index'))) ||
      ((msg.includes('response')) ||
       (msg.includes('question'))) ||
       (msg.includes('file_id'))) {
    console.log('スタンプなどのバリデーション');
    return false;
  }
  */

  return msg;
};

module.exports = hearText;
