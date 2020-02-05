/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-05 11:17:04
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
      const user = yield call(api.current);
      if (user) {
        yield put({ type: 'user', payload: user });
      }
      return user;
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
