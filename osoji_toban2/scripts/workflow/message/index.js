'use strict';


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


}

module.exports = WorkflowMessage;
