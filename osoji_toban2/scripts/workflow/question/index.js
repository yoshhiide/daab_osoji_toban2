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
        'メンバー登録・削除',
        '登録メンバーの確認',
        '通知日時等の設定',
        '管理ルームから解除'
      ]
    };
    this.act.sendFunc({ roomId, send });
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
