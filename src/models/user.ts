/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-06 11:22:26
 * @Description: file content
 */
import { Model } from 'dva';
import get from 'lodash/get';
import * as api from '@/services/user';

const User: Model = {
  namespace: 'user',

  state: {
    user: {},
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const { account, passwd } = payload;
      const res = yield call(api.login, account, passwd);
      if (res && res.data) {
        yield put({ type: 'user', payload: res.data });
      }
      return res;
    },

    // 获取当前用户
    *current(_, { call, put }) {
      const { data } = yield call(api.current);
      if (data) {
        yield put({ type: 'user', payload: data });
      }
      return data;
    },
  },

  reducers: {
    user(state, action) {
      return {
        ...state,
        user: get(action, 'payload'),
      };
    },
  },
};

export default User;
