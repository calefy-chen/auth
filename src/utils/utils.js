import moment from './moment';

/**
 * 日期转换字符串 2018/6/22 15:30
 */
export function timeString(t, format = 'YYYY/MM/DD HH:mm') {
  if (!t) {
    return '';
  }
  return moment(t).format(format);
}
