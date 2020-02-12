import { get, post } from '@/utils/request';
import { timeString } from '@/utils/utils';

/**
 * 解析时间段
 * @param {array} range 时间区间，[start, end]
 * @param {string} formatDate 格式默认YYYYMMDD
 */
function formatTimeRange(range, formatDate = 'YYYYMMDD') {
  let [start, end] = range || [];
  if (start) {
    start = timeString(start, formatDate);
  }
  if (end) {
    end = timeString(end, formatDate);
  }
  return [start, end];
}

// 系统故障预警列表
export function getSystemList(params) {
  const [startAlarmTime, endAlarmTime] = formatTimeRange(params.time, 'YYYY-M-DD');
  const data = {
    ...params,
    startAlarmTime,
    endAlarmTime,
  };
  delete data.time;
  return post('/sys_inspect/systemAlarm/querySystemAlarmList', data);
}

// 系统故障预警详情
export function querySystemAlarmById(params) {
  return post('/sys_inspect/systemAlarm/querySystemAlarmById', params);
}

// 系统故障预警表单提交
export function updateSystemAlarm(params) {
  return post('/sys_inspect/systemAlarm/updateSystemAlarm', params);
}

// 系统故障预警通过预警编号修改误报状态信息
export function updateSystemAlarmStatus(params) {
  return post('/sys_inspect/systemAlarm/updateSystemAlarmStatus', params);
}

// 系统故障预警通过id删除预警信息
export function deleteSystemAlarmById(params) {
  return post('/sys_inspect/systemAlarm/deleteSystemAlarmById', params);
}

// 查询系统类型、预警细类、预警大类
export function queryDictByDictId() {
  return get('/sys_inspect/systemAlarm/querySystemAlarmDictList');
}

// 添加系统故障预警
export function addSystemAlarm(params) {
  return post('/sys_inspect/systemAlarm/addSystemAlarm', params);
}

// 获取链路日志
export function getLinkLogList(params) {
  return get('/sys_inspect/systemAlarm/getLinkLogList', params);
}

// 各系统大类总数量
export function getSystemAlarmTypeCount() {
  return get('/sys_inspect/systemAlarm/getSystemAlarmTypeCount');
}