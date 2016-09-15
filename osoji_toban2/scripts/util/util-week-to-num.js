'use strict';


const utilWeekToNum = (week) => {
  // 曜日変換
  const weekTable = { '日': 0, '月': 1, '火': 2, '水': 3, '木': 4, '金': 5, '土': 6, '日': 7 };
  return weekTable[week];
};

module.exports = utilWeekToNum;
