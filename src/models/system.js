/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-07 17:57:06
 * @Description: file content
 */
import * as api from '@/services/system';

export default {
  namespace: 'system',

  state: {
    // 系统故障列表数据
    systemData: {
      list: [],
      total: 0,
    },
    // 系统故障预警详情
    systemDetail: {},
    // 系统类型
    systemType: [],
    // 预警大类
    alarmBigList: [],
    // 预警细类
    alarmMinList: [],
    // 链路日志
    logs: [],
  },

  effects: {
    // 系统故障列表
    *getSystemList({ payload }, { put, call }) {
      const { data } = yield call(api.getSystemList, { ...payload });
      yield put({
        type: 'setSystemList',
        payload: data || {},
      });
      return Promise.resolve();
    },
    // 系统故障预警详情
    * querySystemAlarmById({ payload }, { put, call }) {
      const { data } = yield call(api.querySystemAlarmById, payload)
      yield put({
        type: 'setSystemDetail',
        payload: data || {},
      })
      return data
    },
    // 更新系统故障预警
    * updateSystemAlarm({ payload }, { call }) {
      return yield call(api.updateSystemAlarm, payload)
    },
    // 通过预警编号修改误报状态信息
    * updateSystemAlarmStatus({ payload }, { call }) {
      return yield call(api.updateSystemAlarmStatus, payload)
    },
    // 通过id删除预警信息
    * deleteSystemAlarmById({ payload }, { call }) {
      return yield call(api.deleteSystemAlarmById, payload)
    },
    // 查询系统类型列表 和 预警大类列表
    * queryDictByDictId(_, { put, call }) {
      const { data } = yield call(api.queryDictByDictId)
      yield put({
        type: 'setDictByDictId',
        payload: data || {},
      })
    },
    // 添加系统故障预警
    * addSystemAlarm({ payload }, { call }) {
      return yield call(api.addSystemAlarm, payload)
    },
    // 链路日志
    * getLinkLogList({ payload }, { put, call }) {
      const { data } = yield call(api.getLinkLogList, payload)
      yield put({
        type: 'setLinkLogList',
        payload: data || {},
      })
      return data
    },
  },

  reducers: {
    setSystemList(state, { payload }) {
      const { list, total } = payload
      return {
        ...state,
        systemData: {
          list: (list || []).map((item, index) => ({ ...item, key: index })),
          total: total || 0,
        }
      }
    },
    setSystemDetail(state, { payload }) {
      return {
        ...state,
        systemDetail: payload
      }
    },
    setDictByDictId(state, { payload }) {
      return {
        ...state,
        systemType: (payload.systemType || []).map((item) => ({ value: item.typeId, name: item.typeName })),
        alarmBigList: (payload.alarmBigList || []).map((item) => ({ value: item.typeId, name: item.typeName })),
        alarmMinList: (payload.alarmMinList || []).map((item) => ({ value: item.typeId, name: item.typeName })),
      }
    },
    setLinkLogList(state, { payload }) {
      return {
        ...state,
        logs: payload
      }
    },
    cleanDetail(state) {
      return {
        ...state,
        systemDetail: {},
        logs: [],
      }
    }
  },
};