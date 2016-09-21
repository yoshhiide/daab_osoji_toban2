'use strict';

const _      = require('lodash');
const moment = require('moment');


// アラート
const cronAlert = ({ act, model, workflow }) => {

  return () => {
    // 現在の曜日・時刻取得
    const nowWeek   = Number(moment().weekday());
    const nowHour   = Number(moment().format('H'));
    const nowMinute = Number(moment().format('m'));

    // 全てのアラート情報取得
    const timers  = model.timers.loadAll();
    const members = model.members.loadAll();
    const chosen  = model.chosen.loadAll();

    // アラート対象チェック
    const domainIds = Object.keys(timers);
    const alertDomainIds = domainIds.filter((domainId) => {
      const {
        choose,
        week,
        start_message,
        start_hour,
        start_minute,
        end_message,
        end_hour,
        end_minute
      } = timers[domainId];

      const member = members[domainId];

      if ((!choose && (choose !== 0)) || (!member || (member.length === 0)) || (week !== nowWeek)) {
        return false;
      }

      if ((start_hour === nowHour) && (start_minute === nowMinute)) {
        return true;
      }

      if ((end_hour === nowHour) && (end_minute === nowMinute)) {
        return true;
      }
    });

    // アラート対象組織
    console.log('[' + new Date() + '] alertDomainIds', alertDomainIds);

    // アラート処理
    // ボットの参加する全トークルーム情報
    const rooms = act.brains.rooms.info;
    const allRoomIds = Object.keys(rooms) || [];

    // アラートメッセージ(開始と終了が同時であれば２つ)
    const alertRoomMessages = (domainId) => {
      let result = [];

      const {
        choose,
        start_message,
        start_hour,
        start_minute,
        end_message,
        end_hour,
        end_minute
      } = timers[domainId];

      if ((start_hour === nowHour) && (start_minute === nowMinute)) {
        result.push(start_message);
      }

      if ((end_hour === nowHour) && (end_minute === nowMinute)) {
        result.push(end_message);
      }

      return result;
    };

    // アラート対象組織のみトークルーム情報
    // { [domainId]: { rooms: [] } };
    const alertDomainRooms = allRoomIds.reduce((result, roomId) => {
      const domainId = rooms[roomId].domainId;

      if (alertDomainIds.includes(domainId)) {
        if (!!result[domainId]) {
          result[domainId].rooms.push(roomId);
        } else {
          result[domainId] = { rooms: [roomId] };
        }
      }

      return result;
    }, {});


    // アラート対象組織・ルーム
    console.log('[' + new Date() + '] alertDomainRooms', alertDomainRooms);

    // アラート対象のトークルームと送信メッセージ
    // [{ domainId, rooms: [], message, choose }]
    const alertRoomsMessages = _.reduce(alertDomainRooms, (result, domainRooms, domainId) => {
      const {
        choose,
        start_message,
        start_hour,
        start_minute,
        end_message,
        end_hour,
        end_minute
      } = timers[domainId];

      // 開始メッセージ
      if ((start_hour === nowHour) && (start_minute === nowMinute)) {
        result.push({ domainId, rooms: domainRooms.rooms, message: start_message, choose });
      }

      // 終了メッセージ（選出なし）
      if ((end_hour === nowHour) && (end_minute === nowMinute)) {
        result.push({ domainId, rooms: domainRooms.rooms, message: end_message, choose: 0 });
      }

      return result;
    }, []);


    // メンバー選出
    // [{ domainId, rooms: [], message, nextMembers: [] }]
    const alertMessages = alertRoomsMessages.map((oneAlert) => {
      const { domainId, choose } = oneAlert;

      // 選出不要の場合（選出数=0, 終了アラートの場合）
      if (!choose) return oneAlert;

      const member = members[domainId];
      const chosenMembers = chosen[domainId] || [];

      // メンバー選出＆選出済み対象者のRedis更新
      const nextMembers = workflow.process.updateChooseMembers({ domainId, member, chosen: chosenMembers, choose: oneAlert.choose });

      return Object.assign({}, oneAlert, { nextMembers });
    });


    // アラート送信
    workflow.message.alert({ alertMessages });
  }
}

module.exports = cronAlert;
