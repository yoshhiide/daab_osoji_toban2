// Description:
//   Utility commands surrounding Hubot uptime.
'use strict';

const _ = require('lodash');

const Redis     = require('./component/redis');
const hearText  = require('./component/hear-text');
const util      = require('./component/util');
const Check     = require('./component/check');
const Members   = require('./component/members');

let _robot;
let redis;
let check;
let members;



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
}


const constructor = (robot) => {
  _robot  = robot;
  redis   = new Redis(robot);
  check   = new Check(robot);
  members = new Members(robot);

  // Redisの準備後、１度実行
  robot.brain.once('loaded', onceLoaded);
};


const hearTextMessage = (res) => {
  // 入力内容
  const msg = hearText(res);
  if (!msg) return;

  res.send('your message is ' + msg);

  // 管理ルームでなければ何もしない
  if (!check.adminRoom(res)) return;

  // 登録メンバー編集
  members.edit({ res, msg });
};

// Redisの準備後、１度実行
const onceLoaded = () => {
  console.log('loaded');
};

// ボットがトークに招待された場合に実行
const joinRoom = (res) => {
  // この組織のID
  const domainId = util.res.getDomainId(res);

  // この組織の管理ルームID
  const adminRoomId = redis.admin.loadRoomId(domainId);

  // 組織に管理ルームがあれば何もしない
  if (!!adminRoomId) return;

  // 組織に管理ルームがなければ、設定メッセージ
  res.send({
    question: 'このトークルームを管理ルームに設定しますか？',
    options : ['設定する']
  });
};

const hearSelect = (res) => {
  const question = util.res.getResQuestion(res);
  const options  = util.res.getResOptions(res);
  const response = util.res.getResponse(res);

  // セレクトスタンプが送信されたものであれば何もしない
  if (_.isUndefined(response)) return false;

  if (question === 'このトークルームを管理ルームに設定しますか？') {
    if (options[response] === '設定する') {
      const domainId = util.res.getDomainId(res);
      const roomId   = util.res.getRoomId(res);

      // Redisにセーブ
      redis.admin.saveRoomId({ domainId, roomId });

      _robot.send({ room: roomId }, {
        text: '管理ルームに設定しました。'
      });

      _robot.send({ room: roomId }, {
        text: [
          'メンバー登録を行うことができます。',
          '',
          '【メンバー登録】',
          '登録するメンバーの名前を入力してください。',
          '',
          '【メンバー一括登録】',
          '一括で登録する場合は、名前を改行区切りで入力してください。',
          '',
          '【メンバー削除】',
          '同じ名前をもう一度入力すると、そのメンバーは削除されます。'
        ].join('\n')
      });

      sendWhatDo(roomId);
    }
    return;
  }

  if (question === '何をしますか？') {
    if (options[response] === '登録メンバーの確認') {
      const domainId = util.res.getDomainId(res);
      const roomId   = util.res.getRoomId(res);

      // Redisからこの組織の登録メンバー取得
      const members = redis.members.loadRoomId(domainId);

      if (members.length === 0) {
        _robot.send({ room: roomId }, {
          text: '登録メンバーはいませんでした。'
        });

        // 何をしますか？
        sendWhatDo(roomId);
      } else {
        // 登録メンバー
        _robot.send({ room: roomId }, {
          text: members.join('\n')
        });

        // 何をしますか？
        sendWhatDo(roomId);
      }

      return;
    }

    if (options[response] === '管理ルームから解除') {
      const domainId = util.res.getDomainId(res);
      const roomId   = util.res.getRoomId(res);

      // Redisにセーブ
      redis.admin.domainInit(domainId);

      _robot.send({ room: roomId }, {
        text: '管理ルームから解除しました。'
      });

      _robot.send({ room: roomId }, {
        question: 'このトークルームを管理ルームに設定しますか？',
        options : ['設定する']
      });
    }
    return;
  }
};

const sendWhatDo = (roomId) => {
  _robot.send({ room: roomId }, {
    question: '何をしますか？',
    options : [
      'メンバー登録・削除',
      '登録メンバーの確認',
      '通知日時等の設定',
      '管理ルームから解除'
    ]
  });
};
