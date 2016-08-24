'use strict';

const _ = require('lodash');

class UtilRes {

  // ユーザID
  getUserId(res) {
    return _.get(res, 'message.user.id');
  }

  // ユーザ名
  getUserName(res) {
    return _.get(res, 'message.user.name');
  }

  // ユーザemail
  getUserEmail(res) {
    return _.get(res, 'message.user.email');
  }

  // ルームID
  getRoomId(res) {
    return _.get(res, 'message.room');
  }

  // メッセージID
  getMessageId(res) {
    return _.get(res, 'message.id');
  }

  // ドメインId
  getDomainId(res) {
    const rooms = _.get(res, 'message.rooms');
    const roomId = this.getRoomId(res);
    return _.get(rooms, `${roomId}.domainId`);


    const domain64 = _.get(res, 'message.user.domainId');
    return `_${domain64.high}_${domain64.low}`;
  }

  // トークルームの種類(ペア or グループ)
  getRoomType(res) {
    return _.get(res, 'message.roomType') === 1 ? 'pair' : 'group';
  }

  // セレクトスタンプの送信or返信
  getSelectSendResponse(res) {
    return _.isUndefined(_.get(res, 'json.response')) ? 'send' : 'response';
  }

  // セレクトスタンプ送信
  getSelectStamp(res) {
    const question = _.get(res, 'json.question');

    if (_.isUndefined(question)) {
      return false;
    }

    return _.get(res, 'json');
  }

  // セレクトスタンプ返信
  getSelectStampRes(res) {
    const question = _.get(res, 'json.question');
    const replyTo = _.get(res, 'json.in_reply_to');

    if (_.isUndefined(question) || _.isUndefined(replyTo)) {
      return false;
    }

    return _.get(res, 'json');
  }

  // セレクトスタンプ返信(question)
  getResQuestion(res) {
    return _.get(this.getSelectStampRes(res), 'question');
  }

  // セレクトスタンプ返信(options)
  getResOptions(res) {
    return _.get(this.getSelectStampRes(res), 'options');
  }

  // セレクトスタンプ返信(response)
  getResponse(res) {
    return _.get(this.getSelectStampRes(res), 'response');
  }

  // セレクトスタンプの返信先メッセージID
  getSelectReplyMessageId(res) {
    return _.get(res, 'json.in_reply_to');
  }

  // ルーム内ユーザー情報
  getRoomUsers(res) {
    return _.get(res, 'message.roomUsers');
  }
}

module.exports = new UtilRes();
