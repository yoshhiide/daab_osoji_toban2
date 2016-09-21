'use strict';

const util = require('../../util');


class WorkflowMessage {

  constructor({ act, model, workflow }) {
    this.act      = act;
    this.model    = model;
    this.workflow = workflow;
  }

  // 管理ルーム設定のメッセージ
  setAdminRoom({ roomId }) {
    const send = { text: '管理ルームに設定しました。' };
    this.act.sendFunc({ roomId, send });
  }

  unsetAdminRoom({ roomId }) {
    const send = { text: '管理ルームから解除しました。' };
    this.act.sendFunc({ roomId, send });
  }

  // メンバー登録説明
  settingMember({ roomId }) {
    const send = {
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
    };
    this.act.sendFunc({ roomId, send });
  }

  // 選出メンバー数
  settingChoose({ roomId }) {
    const send = { text: 'アラート時に選出するメンバー数を、半角数値で入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 曜日
  settingWeek({ roomId }) {
    const send = { text: 'アラートする曜日を、漢字１文字で入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 開始メッセージ
  settingStartMessage({ roomId }) {
    const send = { text: '開始のアラートのメッセージを入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 開始時刻(HOUR)
  settingStartHour({ roomId }) {
    const send = { text: '開始のアラートの時刻(Hour)を、半角数値で入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 開始時刻(MINUTE)
  settingStartMinute({ roomId }) {
    const send = { text: '開始のアラートの時刻(Minute)を、半角数値で入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 終了メッセージ
  settingEndMessage({ roomId }) {
    const send = { text: '終了のアラートのメッセージを入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 終了時刻(HOUR)
  settingEndHour({ roomId }) {
    const send = { text: '終了のアラートの時刻(Hour)を、半角数値で入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 終了時刻(MINUTE)
  settingEndMinute({ roomId }) {
    const send = { text: '終了のアラートの時刻(Minute)を、半角数値で入力してください。' };
    this.act.sendFunc({ roomId, send });
  }

  // 設定情報
  settingInfo({ domainId, roomId }) {
    this.settingTimerInfo({ domainId, roomId });
    this.settingMemberInfo({ domainId, roomId });
  }

  // 設定情報(アラート)
  settingTimerInfo({ domainId, roomId }) {
    const timer = this.model.timers.loadOne({ domainId });
    const send = {
      text: [
        '【現在の設定状況①】',
        `選出人数：${timer.choose || 'ー'}`,
        `曜日　　：${util.numToWeek(timer.week) || '－'}`,
        `開始時刻：${timer.start_hour || 'ー'}:${util.minuteFormat(timer.start_minute) || 'ー'}`,
        `終了時刻：${timer.end_hour || 'ー'}:${util.minuteFormat(timer.end_minute) || 'ー'}`,
        `開始メッセージ：${timer.start_message || 'ー'}`,
        `終了メッセージ：${timer.end_message || 'ー'}`
      ].join('\n')
    };
    this.act.sendFunc({ roomId, send });
  }

  // 設定情報(メンバー)
  settingMemberInfo({ domainId, roomId }) {
    const member = this.model.members.loadOne({ domainId });
    const send = {
      text: [
        '【現在の設定状況②】',
        '登録メンバー：',
        member.join('\n')
      ].join('\n')
    };
    this.act.sendFunc({ roomId, send });
  }



  notFoundSelect({ roomId }) {
    const send = { text: '選択肢から選んでください。' };
    this.act.sendFunc({ roomId, send });
  }

  notFoundAction({ roomId }) {
    const send = { text: '選択肢から選んでください。' };
    this.act.sendFunc({ roomId, send });
  }

  notAllowManyInput({ roomId }) {
    const send = { text: '複数行の入力は受け付けていません。入力し直してください。' };
    this.act.sendFunc({ roomId, send });
  }

  notAllowStringAllowNumeric({ roomId }) {
    const send = { text: '数値入力のみ受け付けています。入力し直してください。' };
    this.act.sendFunc({ roomId, send });
  }

  notAllowNotWeek({ roomId }) {
    const send = { text: [
      '曜日入力のみ受け付けています。入力し直してください。',
      '',
      '【注意】',
      '曜日は漢字１文字で入力してください。',
      '複数曜日指定には未対応です。'
    ].join('\n')};
    this.act.sendFunc({ roomId, send });
  }


  // アラート送信
  alert({ alertMessages }) {
    console.log('TODO: workflow.message.alert()', alertMessages);

    alertMessages.forEach((roomMessage) => {

      // メッセージ＋選出
      const message = !!roomMessage.nextMembers.length
        ? roomMessage.message + '\n\n' + roomMessage.nextMembers.join('\n')
        : roomMessage.message;

      roomMessage.rooms.forEach((roomId) => this.act.sendFunc({ roomId, send: { text: message } }));

      // 選出メンバーが０であれば処理しない
      if (!roomMessage.nextMembers.length) return;


      // 入れ替え・キャンセル
      const selectMessage = {
        question: '選出されたメンバーを入れ替えることが可能です。\n入れ替える場合は対象者を選択してください。',
        options : [...roomMessage.nextMembers, '全員再選出', '選出をキャンセル']
      };

      roomMessage.rooms.forEach((roomId) => this.act.sendFunc({ roomId, send: selectMessage }));
    });
  }
}

module.exports = WorkflowMessage;
