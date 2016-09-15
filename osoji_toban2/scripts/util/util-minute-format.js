'use strict';


// 分表示に整形
const utilMinuteFormat = (minute) => {
  const minuteNum = Number(minute);

  // 数値でない場合
  if (!minuteNum && (minuteNum !== 0)) return;

  return (minuteNum + 100).toString().substr(-2, 2);
};

module.exports = utilMinuteFormat;
