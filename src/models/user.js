/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-06 11:22:26
 * @Description: file content
 */
import get from 'lodash/get';
import * as api from '@/services/user';
import {
  rsaEncrypt,
  setCookie,
  setAuthCookie,
} from '@/utils/utils';

export default {
  namespace: 'user',

  state: {
    user: {},
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const { account, passwd } = payload;
      window.CMS_OA_CODE = account;
      const res = yield call(api.login, {
        oaCode: account,
        passwd: rsaEncrypt(passwd),
        imageCode: 666,
      });
      if (res && res.data && res.data.token) {
        setAuthCookie(res.data.token);
        yield put({ type: 'user', payload: res.data });
        return true
      }
      return false;
    },

    *logout(_, { put }) {
      setCookie({ 'auth.token': '', expires: 0 });
      yield put({ type: 'cleanUser' });
    },

    // 获取当前用户
    *current(_, { call, put }) {
      const { data } = yield call(api.current);
      if (data) {
        yield put({ type: 'user', payload: data });
        const account = (data.account || '').toLowerCase();
        window.CMS_OA_CODE = account;
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
    cleanUser() {
      return {
        user: {},
      };
    },
  },
};
