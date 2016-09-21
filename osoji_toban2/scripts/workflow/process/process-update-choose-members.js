'use strict';

const _ = require('lodash');


// メンバー選出
// 選出済み対象者のRedis更新
const updateChooseMembers = ({ model, workflow }) => {

  return ({ domainId, member, chosen, choose }) => {
    // 選出対象メンバー
    const targetMembers = _.xor(member, chosen);

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
    //    0になった場合は、今回選出されなかったメンバーから選出
    let round = false;
    const chosenObj = {};
    const targetSize = _.size(targetMembers);

    const chooseMembers = _.range(choose).map(() => {
      // 未選出メンバーと今回選出メンバー数が同値になった場合、１周したことになる
      if (targetSize === _.size(chosenObj)) {
        round = true;
        targetMembers.push(...chosen);
      }

      let idx;
      let unachieved = true;
      while(unachieved) {
        // 選出。既に選出済みであれば、繰り返す
        idx = Math.floor(Math.random() * _.size(targetMembers));
        if (!chosenObj[idx]) {
          chosenObj[idx] = true;
          unachieved = false;
        }
      }

      return targetMembers[idx];
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
