/* eslint-disable func-names */
/* eslint-disable no-lonely-if */
// 额外的日期管理配置
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.calendarFormat = function(myMoment, now) {
  let t = '';
  /**
   * 第三个参数为是否取整数，以 24:00 为准，相当于 Math.floor
   * 如当前日期是 09-02 10:23，取 09-01 02:13 的 diff 为 -0.9014，
   * 理论上已经超过 24 小时了，应该 < -1
   * 实际上 取 09-01 00:00 的值方为 -1
   */
  const diff = myMoment.diff(now, 'days', true);
  const isSomeYear = now.year() === myMoment.year();
  // 周日的 now.days() 是 0
  const today = now.days() === 0 ? 7 : now.days();
  // 优先级排序应以今天为起点，如：今天 > 昨天 > 上周，避免昨天就是上周日的显示优先级错误
  if (diff > 0) {
    // 今天 + 未来
    if (diff < 1) {
      t = 'sameDay'; // 今天
    } else if (diff < 2) {
      t = 'nextDay'; // 明天
    } else if (isSomeYear) {
      t = 'sameYear'; // 其他日期
    } else {
      t = 'elseYear'; // 明年的
    }
  } else {
    // 过去
    if (diff > -1) {
      t = 'lastDay'; // 昨天
    } else if (diff > -(today - 1)) {
      t = 'thisWeek'; // 本周
    } else if (diff > -(today + 6)) {
      t = 'lastWeek'; // 上周
    } else if (isSomeYear) {
      t = 'sameYear'; // 同年其他日期
    } else {
      t = 'elseYear'; // 去年的
    }
  }
  return t;
};

moment.updateLocale('zh-cn', {
  weekdays: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  calendar: {
    sameDay: 'LT',
    nextDay: '[明天]',
    lastDay: '[昨天]',
    thisWeek: 'dddd',
    lastWeek: '[上]dddd',
    sameYear: 'l',
    elseYear: 'll',
  },
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD HH:mm',
    LL: 'YYYY年 M月D日',
    LLL: 'YYYY年 M月D日 Ah点mm分',
    LLLL: 'YYYY年 M月D日（dddd）Ah点mm分',
    l: 'M-D',
    ll: 'YYYY-MM-DD',
    lll: 'YYYY年 M月D日 HH:mm',
    llll: 'YYYY年 M月D日（dddd） HH:mm',
  },
});

export default moment;
