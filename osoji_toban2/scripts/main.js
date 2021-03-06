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

  // cron
  workflow.process.cronSet();
};


const hearStamp = (res) => {
  // 管理ルームでなければ何もしない
  if (!workflow.check.adminRoom({ res })) return;

  // ルームID, 組織のID
  const roomId = util.res.getRoomId({ res });
  const domainId = util.res.getDomainId({ res });

  // アクション初期化
  model.admin.saveAction({ domainId, action: 'HOME' });

  // アクション送信
  workflow.question.whatDo({ roomId });
};


const hearTextMessage = (res) => {
  // 入力内容
  const msg = util.hearText({ res });
  if (!msg) return;

  // 管理ルームでなければ何もしない
  if (!workflow.check.adminRoom({ res })) return;

  // ルームID, 組織のID
  const roomId   = util.res.getRoomId({ res });
  const domainId = util.res.getDomainId({ res });

  // 現在のアクション
  const action = model.admin.loadAction({ domainId });

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
      workflow.message.notFoundAction({ roomId });

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
  const adminRoomId = model.admin.loadRoomId({ domainId });

  // 組織に管理ルームがあれば何もしない
  if (!!adminRoomId) return;

  // 組織に管理ルームがなければ、設定メッセージ
  workflow.question.setAdminRoom({ roomId });
};

const hearSelect = (res) => {
  const roomId   = util.res.getRoomId({ res });
  const domainId = util.res.getDomainId({ res });
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

    // 選択項目別処理
    switch (options[response]) {

      case '通知項目設定': {
        model.admin.saveAction({ domainId, action: 'SETTING' });
        workflow.question.whatSetting({ roomId });
        break;
      }

      case '登録メンバーの確認': {
        workflow.answer.confirmMember({ res });
        break;
      }

      case '管理ルームから解除': {
        workflow.answer.adminRoom.unset({ res });
        break;
      }

      default: {
        // 選択肢から選んでください
        workflow.message.notFoundSelect({ roomId });
        workflow.question.whatSetting({ roomId });
      }

    }
  }


  if (question === '設定項目を選んでください。') {

    // 選択項目別処理
    switch (options[response]) {

      case 'メンバー': {
        // 登録メンバー編集
        model.admin.saveAction({ domainId, action: 'MEMBER' });
        workflow.message.settingMember({ roomId });
        break;
      }

      case '選出メンバー数': {
        // 選出メンバー数編集
        model.admin.saveAction({ domainId, action: 'CHOOSE' });
        workflow.message.settingChoose({ roomId });
        break;
      }

      case '曜日': {
        // アラート曜日編集
        model.admin.saveAction({ domainId, action: 'WEEK' });
        workflow.message.settingWeek({ roomId });
        break;
      }

      case '開始メッセージ': {
        // 開始時のメッセージ編集
        model.admin.saveAction({ domainId, action: 'START_MESSAGE' });
        workflow.message.settingStartMessage({ roomId });
        break;
      }

      case '開始時刻（Hour）': {
        // 開始時刻(Hour)編集
        model.admin.saveAction({ domainId, action: 'START_HOUR' });
        workflow.message.settingStartHour({ roomId });
        break;
      }

      case '開始時刻（Minute）': {
        // 開始時刻(minute)編集
        model.admin.saveAction({ domainId, action: 'START_MINUTE' });
        workflow.message.settingStartMinute({ roomId });
        break;
      }

      case '終了メッセージ': {
        // 終了時のメッセージ編集
        model.admin.saveAction({ domainId, action: 'END_MESSAGE' });
        workflow.message.settingEndMessage({ roomId });
        break;
      }

      case '終了時刻（Hour）': {
        // 終了時刻(Hour)編集
        model.admin.saveAction({ domainId, action: 'END_HOUR' });
        workflow.message.settingEndHour({ roomId });
        break;
      }

      case '終了時刻（Minute）': {
        // 終了時刻(minute)編集
        model.admin.saveAction({ domainId, action: 'END_MINUTE' });
        workflow.message.settingEndMinute({ roomId });
        break;
      }

      case '[ 設定終了 ]': {
        model.admin.saveAction({ domainId, action: 'HOME' });
        workflow.question.whatDo({ roomId });
        break;
      }

      default: {
        // 選択肢から選んでください
        workflow.message.notFoundSelect({ roomId });

        // アクション送信
        workflow.question.whatSetting({ roomId });
      }

    }
  }


  if (question === '選出されたメンバーを入れ替えることが可能です。\n入れ替える場合は対象者を選択してください。') {

    // 選択項目別処理
    switch (options[response]) {

      case '全員再選出': {
        // TODO
        break;
      }

      case '選出をキャンセル': {
        // TODO
        break;
      }

      default: {
        // メンバー名の選択の場合
        // TODO
      }
    }
  }
};

