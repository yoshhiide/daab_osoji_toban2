// Description:
//   Utility commands surrounding Hubot uptime.
'use strict';

const _ = require('lodash');

const IORedisOsoji = require('./component/io-redis-osoji');
const hearText     = require('./component/hear-text');
const _res         = require('./component/util-res');

let _robot;
let _io;



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
  _robot = robot;
  _io    = new IORedisOsoji(robot.brain);

  // Redisの準備後、１度実行
  robot.brain.once('loaded', onceLoaded);
};

const hearTextMessage = (res) => {
  // 入力内容
  const msg = hearText(res);
  if (!msg) return;

  res.send('your message is ' + msg);

  // 管理ルームでなければ何もしない
  if (!checkAdminRoom(res)) return;

  // 登録メンバー編集
  editMembers({res, msg});
};

// Redisの準備後、１度実行
const onceLoaded = () => {
  console.log('loaded');
  const adminRoomIds = _io.brainGetAllAdminRoomIds();
};

// ボットがトークに招待された場合に実行
const joinRoom = (res) => {
  // この組織の管理ルームID
  const adminRoomId = checkAdminRoomId(res);

  // 組織に管理ルームがあれば何もしない
  if (!!adminRoomId) return;

  // 組織に管理ルームがなければ、設定メッセージ
  res.send({
    question: 'このトークルームを管理ルームに設定しますか？',
    options : ['設定する']
  });
};

const hearSelect = (res) => {
  const question = _res.getResQuestion(res);
  const options  = _res.getResOptions(res);
  const response = _res.getResponse(res);

  // セレクトスタンプが送信されたものであれば何もしない
  if (_.isUndefined(response)) return false;

  if (question === 'このトークルームを管理ルームに設定しますか？') {
    if (options[response] === '設定する') {
      const domainId = _res.getDomainId(res);
      const roomId   = _res.getRoomId(res);

      // Redisにセーブ
      _io.setAdminRoomId({domainId, roomId});

      _robot.send({room: roomId}, {
        text: '管理ルームに設定しました。'
      });

      _robot.send({room: roomId}, {
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
      const domainId = _res.getDomainId(res);
      const roomId   = _res.getRoomId(res);

      // Redisからこの組織の登録メンバー取得
      const members = _io.getMembers(domainId);

      if (members.length === 0) {
        _robot.send({room: roomId}, {
          text: '登録メンバーはいませんでした。'
        });

        // 何をしますか？
        sendWhatDo(roomId);
      } else {
        // 登録メンバー
        _robot.send({room: roomId}, {
          text: members.join('\n')
        });

        // 何をしますか？
        sendWhatDo(roomId);
      }

      return;
    }

    if (options[response] === '管理ルームから解除') {
      const domainId = _res.getDomainId(res);
      const roomId   = _res.getRoomId(res);

      // Redisにセーブ
      _io.setAdminRoomId({domainId, roomId: false});

      _robot.send({room: roomId}, {
        text: '管理ルームから解除しました。'
      });

      _robot.send({room: roomId}, {
        question: 'このトークルームを管理ルームに設定しますか？',
        options : ['設定する']
      });
    }
    return;
  }
};

const sendWhatDo = (roomId) => {
  _robot.send({room: roomId}, {
    question: '何をしますか？',
    options : ['登録メンバーの確認', '管理ルームから解除']
  });
};

// このトークルームが管理ルームであるか判定(true/false)
const checkAdminRoom = (res) => {
  const roomId = _res.getRoomId(res);
  const adminRoomId = checkAdminRoomId(res);

  return (adminRoomId === roomId);
};

const checkAdminRoomId = (res) => {
  // この組織のID
  const domainId = _res.getDomainId(res);

  // この組織の管理ルームID
  return _io.getAdminRoomId(domainId);
};

const editMembers = ({res, msg}) => {
  const domainId = _res.getDomainId(res);

  // 入力文字列を改行区切りにする
  let members = msg.split('\n');

  // 入力文字列をトリム・空行を除外する
  members = members.map(_.trim).filter(m => m);

  // 何もなければ何もしない
  if (members.length === 0) return;

  // 登録済みメンバー
  const registeredMembers = _io.getMembers(domainId);

  // 比較し、存在すれば削除、そうでなければ追加する
  const newRegisterMembers = compareMembers({registeredMembers, newMembers: members});

  // メンバーを上書登録
  _io.setMembers({domainId, members: newRegisterMembers});
};

// 比較し、存在すれば削除、そうでなければ追加する
const compareMembers = ({registeredMembers, newMembers}) => {
  // 重複なしメンバーを返す
  return _.xor(registeredMembers, newMembers);
};
