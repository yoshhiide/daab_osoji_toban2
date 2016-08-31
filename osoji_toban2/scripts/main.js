// Description:
//   Utility commands surrounding Hubot uptime.
'use strict';

const _ = require('lodash');

const Act      = require('./act');
const Model    = require('./model');
const Workflow = require('./workflow');
const util     = require('./util');

let act;
let model;
let workflow;


module.exports = (robot) => {
  // 初期設定
  constructor(robot);

  // ボットがトークに参加
  robot.join(joinRoom);

  // 誰かがトークに参加
  robot.enter(res => res.send(`Hi! ${res.message.user.name}`));

  // メッセージ受信
  robot.hear(/([\s\S]+)/, hearTextMessage);

  // セレクトスタンプ受信
  robot.hear('select', hearSelect);

  // スタンプ受信
  robot.hear('stamp', hearStamp);
}


const constructor = (robot) => {
  act      = new Act({ robot });
  model    = new Model({ robot });
  workflow = new Workflow({ act, model });

  // Redisの準備後、１度実行
  robot.brain.once('loaded', onceLoaded);
};

// Redisの準備後、１度実行
const onceLoaded = () => {
  console.log('loaded');
};


const hearStamp = (res) => {
  // 管理ルームでなければ何もしない
  if (!workflow.check.adminRoom({ res })) return;

  // ルームID, 組織のID
  const roomId = util.res.getRoomId({ res });
  const domainId = util.res.getDomainId({ res });

  // アクション初期化
  model.redis.admin.saveAction({ domainId, action: 'HOME' });

  // アクション送信
  workflow.question.whatDo({ roomId });
};


const hearTextMessage = (res) => {
  // 入力内容
  const msg = util.hearText({ res });
  if (!msg) return;

  res.send('your message is ' + msg);

  // 管理ルームでなければ何もしない
  if (!workflow.check.adminRoom({ res })) return;

  // ルームID, 組織のID
  const roomId   = util.res.getRoomId({ res });
  const domainId = util.res.getDomainId({ res });

  // 現在のアクション
  const action = model.redis.admin.loadAction({ domainId });

  // アクション別処理
  switch (action) {

    case 'MEMBER': {
      // 登録メンバー編集
      workflow.edit.member({ res, msg });
      break;
    }

    case 'CHOOSE': {
      // 選出メンバー数編集
      workflow.edit.choose({ res, msg });
      break;
    }

    case 'WEEK': {
      // アラート曜日編集
      workflow.edit.week({ res, msg });
      break;
    }

    case 'START_MESSAGE': {
      // 開始時のメッセージ編集
      workflow.edit.startMessage({ res, msg });
      break;
    }

    case 'START_HOUR': {
      // 開始時刻(Hour)編集
      workflow.edit.startHour({ res, msg });
      break;
    }

    case 'START_MINUTE': {
      // 開始時刻(minute)編集
      workflow.edit.startMinute({ res, msg });
      break;
    }

    case 'END_MESSAGE': {
      // 終了時のメッセージ編集
      workflow.edit.endMessage({ res, msg });
      break;
    }

    case 'END_HOUR': {
      // 終了時刻(Hour)編集
      workflow.edit.endHour({ res, msg });
      break;
    }

    case 'END_MINUTE': {
      // 終了時刻(minute)編集
      workflow.edit.endMinute({ res, msg });
      break;
    }

    default: {
      // 選択肢から選んでください
      workflow.send.notFoundAction({ roomId });

      // アクション送信
      workflow.question.whatDo({ roomId });
    }

  }
};

// ボットがトークに招待された場合に実行
const joinRoom = (res) => {
  // ルームID, 組織のID
  const roomId   = util.res.getRoomId({ res });
  const domainId = util.res.getDomainId({ res });

  // この組織の管理ルームID
  const adminRoomId = model.redis.admin.loadRoomId({ domainId });

  // 組織に管理ルームがあれば何もしない
  if (!!adminRoomId) return;

  // 組織に管理ルームがなければ、設定メッセージ
  workflow.question.setAdminRoom({ roomId });
};

const hearSelect = (res) => {
  const question = util.res.getResQuestion({ res });
  const options  = util.res.getResOptions({ res });
  const response = util.res.getResponse({ res });

  // セレクトスタンプが送信されたものであれば何もしない
  if (_.isUndefined(response)) return false;

  if (question === 'このトークルームを管理ルームに設定しますか？') {
    if (options[response] === '設定する') {
      workflow.answer.adminRoom.set({ res });
      return;
    }

    return;
  }

  // 管理ルームでなければ何もしない
  if (!workflow.check.adminRoom({ res })) return;

  if (question === '何をしますか？') {
    if (options[response] === '登録メンバーの確認') {
      workflow.answer.confirmMember({ res });
      return;
    }

    if (options[response] === '管理ルームから解除') {
      workflow.answer.adminRoom.unset({ res });
      return;
    }

    return;
  }
};

