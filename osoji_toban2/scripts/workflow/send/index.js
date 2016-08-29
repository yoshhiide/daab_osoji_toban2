'use strict';


class WorkflowSend {

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
  settingMembers({ roomId }) {
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


}

module.exports = WorkflowSend;
