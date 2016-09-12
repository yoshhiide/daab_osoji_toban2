'use strict';


class WorkflowQuestion {

  constructor({ act, model, workflow }) {
    this.act      = act;
    this.model    = model;
    this.workflow = workflow;
  }

  whatDo({ roomId }) {
    const send = {
      question: '何をしますか？',
      options : [
        '通知項目設定',
        '登録メンバーの確認',
        '管理ルームから解除'
      ]
    };
    this.act.sendFunc({ roomId, send });
  }

  whatSetting({ roomId }) {
    const send1 = {
      question: '設定項目を選んでください。',
      options : [
        'メンバー',
        '選出メンバー数',
        '曜日',
        '開始メッセージ',
        '開始時刻（Hour）',
        '開始時刻（Minute）',
        '終了メッセージ',
        '終了時刻（Hour）',
        '終了時刻（Minute）',
      ]
    };
    const send2 = {
      question: '設定項目を選んでください。',
      options : [
        '[ 設定終了 ]'
      ]
    };
    this.act.sendFunc({ roomId, send: send1 });
    this.act.sendFunc({ roomId, send: send2 });
  }

  setAdminRoom({ roomId }) {
    const send = {
      question: 'このトークルームを管理ルームに設定しますか？',
      options : ['設定する']
    };
    this.act.sendFunc({ roomId, send });
  }



}

module.exports = WorkflowQuestion;
