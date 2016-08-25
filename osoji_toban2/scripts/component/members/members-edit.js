const _ = require('lodash');

const util  = require('../util');
const Redis = require('../redis');

// メンバー登録・削除
class membersEdit {

  constructor(robot) {
    const redis = new Redis(robot);

    return ({res, msg}) => {
      const domainId = util.res.getDomainId(res);

      // 入力文字列を改行区切り・トリム・空行除外
      const members = msg.split('\n').map(_.trim).filter(m => m);

      // 何もなければ何もしない
      if (members.length === 0) return;

      // 登録済みメンバー
      const registeredMembers = redis.members.loadOne(domainId);

      // 比較し、存在すれば削除、そうでなければ追加する(=重複なしメンバーを残す)
      const newRegisterMembers = _.xor(registeredMembers, members);

      // メンバーを上書登録
      redis.members.save({domainId, members: newRegisterMembers});
    };
  }
}

module.exports = membersEdit;