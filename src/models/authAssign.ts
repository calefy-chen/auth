/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-11 09:52:07
 * @Description: file content
 */
import { Model } from 'dva';
import get from 'lodash/get';
import * as api from '@/services/authAssign';

const authAssign: Model = {
  namespace: 'authAssign',

  state: {
    forRoleData:[],
    toWhoData:{}
  },

  effects: {
    *authAssignToRole({ payload }, { call }) {
      const { roleId, items } = payload;
      const res = yield call(api.authAssignToRole, roleId, items);
      return res;
    },
    *getAuthAssignForRole({ payload }, { call, put }) {
      const res = yield call(api.getAuthAssignForRole, payload);
      if (res && res.data) {
        yield put({ type: 'setAuthAssignForRole', payload: res.data });
      }
      return res;
    },
    *getAssignedToWho({ payload }, { call, put }) {
      const { itemId } = payload;
      const res = yield call(api.getAssignedToWho, itemId);
      if (res && res.data) {
        yield put({ type: 'setAssignedToWho', payload: res.data });
      }
      return res;
    },
  },

  reducers: {
    setAuthAssignForRole(state, action) {
      return {
        ...state,
        forRoleData: get(action, 'payload').map((item: { toString: () => any; }) => {return item.toString()}),
      };
    },
    setAssignedToWho(state, action) {
      return {
        ...state,
        toWhoData: get(action, 'payload'),
      };
    }
  },
};

export default authAssign;
