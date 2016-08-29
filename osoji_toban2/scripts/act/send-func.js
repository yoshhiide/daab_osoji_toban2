'use strict';

const merge = require('merge');


// メッセージ送信処理
const sendFunc = ({ robot }) => ({ roomId, send }) => new Promise((resolve, reject) => {
  const onsend = (sent, msg) => resolve(`_${msg.id.high}_${msg.id.low}`);
  const sendObject = merge.recursive(true, send, { onsend });
  robot.send({ room: roomId }, sendObject);
});

module.exports = sendFunc;
