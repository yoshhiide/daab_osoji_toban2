'use strict';

const _    = require('lodash');
const util = require('../../util');


// メンバー登録・削除
const editMember = ({ act, model, workflow }) => {

  return ({ res, msg }) => {
    const domainId = util.res.getDomainId({ res });
    const roomId   = util.res.getRoomId({ res });

    // 入力文字列を改行区切り・トリム・空行除外
    const members = msg.split('\n').map(_.trim).filter(m => m);

    // 何もなければ何もしない
    if (members.length === 0) return;


    // A. 登録済みメンバー
    const registeredMembers = model.members.loadOne({ domainId });

    // 比較し、存在すれば削除、そうでなければ追加する(=重複なしメンバーを残す)
    const newRegisterMembers = _.xor(registeredMembers, members);
    console.log('メンバー確認:', registeredMembers, members);

    // メンバーを上書登録
    model.members.save({ domainId, members: newRegisterMembers });


    // B. 削除対象メンバー
    const chosenMembers = model.chosen.loadOne({ domainId });
    const deleteMembers = _.intersection(registeredMembers, members);

    if (0 < deleteMembers.length) {
      // 選出済みメンバーに存在する場合は削除する
      const newChosenMembers = _.pullAll(chosenMembers, deleteMembers);

      // 選出済みメンバーを上書登録
      model.chosen.save({ domainId, chosen: newChosenMembers });
    }


    // 現在の設定情報をメッセージ送信
    workflow.message.settingInfo({ domainId, roomId });

    // アクション設定
    model.admin.saveAction({ domainId, action: 'SETTING' });

    // 設定メッセージ送信
    workflow.question.whatSetting({ roomId });
  };

};

module.exports = editMember;
