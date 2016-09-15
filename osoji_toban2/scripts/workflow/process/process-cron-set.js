'use strict';

const CronJob = require('cron').CronJob;


// cron設定(アラート)
const cronSet = ({ workflow }) => {
  let job1;

  return () => {
    // ===== === cron === ======
    // 起動 [毎日, 8時〜21時59分, 毎分00秒時] デモ用制限
    job1 = new CronJob({
      cronTime: `00 * 8-21 * * *`,
      onTick  : workflow.process.cronAlert,
      start   : false,
      timeZone: 'Asia/Tokyo'
    });
    job1.start();
  };
}

module.exports = cronSet;
