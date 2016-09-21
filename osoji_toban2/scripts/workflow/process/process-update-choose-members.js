'use strict';

const _ = require('lodash');


// メンバー選出
// 選出済み対象者のRedis更新
const updateChooseMembers = ({ model, workflow }) => {

  return ({ domainId, member, chosen, choose }) => {
    // 選出対象メンバー（シャッフル）
    const targetMembers = _.shuffle(_.xor(member, chosen));

    // A. 選択不可の場合は空配列を返す
    if ((member.length === 0) || (choose === 0)) {
      return [];
    }


    // B. 選出人数が全メンバー以上であれば、全メンバーを返す
    if (member.length <= choose) {
      // 選出済み対象者の更新
      model.chosen.save({ domainId, chosen: member });
      return member;
    }


    // C. 選出対象メンバー数を判定しながら選出
    let round = false;

    const chooseMembers = _.range(choose).map(() => {
      // 1巡した場合、今回選出対象でなかったメンバーから選出
      if (targetMembers.length <= 0) {
        round = true;
        targetMembers.push(..._.shuffle(chosen));
      }
      return targetMembers.pop();
    });

    // 選出済み対象者の更新
    if (round) {
      // 1巡した場合は上書き
      model.chosen.save({ domainId, chosen: chooseMembers });
    } else {
      // 1巡しなかった場合は追加
      model.chosen.save({ domainId, chosen: [...chosen, ...chooseMembers] });
    }
    return chooseMembers;
  };
}

module.exports = updateChooseMembers;
