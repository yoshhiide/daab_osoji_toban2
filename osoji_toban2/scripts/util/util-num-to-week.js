'use strict';


const utilNumToWeek = (weekNum) => {
  // 曜日変換
  const weekTable = { 0: '日', 1: '月', 2: '火', 3: '水', 4: '木', 5: '金', 6: '土', 7: '日' };
  return weekTable[weekNum];
};

module.exports = utilNumToWeek;
