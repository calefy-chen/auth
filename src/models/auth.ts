/*
 * @Author: 王硕
 * @Date: 2020-02-06 14:55:13
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-09 20:11:57
 * @Description: file content
 */
import { Model } from 'dva';
import get from 'lodash/get';
import * as api from '@/services/auth';

const Auth: Model = {
  namespace: 'auth',
  state: {
    authList: [],
    tabKey:'role'
  },

  effects: {
    *getTypeKey({ payload },{put}){
      yield put({ type: 'setTypeKey', payload: payload })
    },
    *getAuthList({ payload }, { call, put }) {
      const res = yield call(api.getAuthList, payload);
      if (res && res.data) {
        yield put({ type: 'setAuthList', payload: res.data.tree });
      }
      return res;
    },
    *addAuth({ payload }, { call }) {
      const { projectId, type, parentId, name, code, content } = payload;
      const res = yield call(api.addAuth, projectId, type, parentId, name, code, content);
      return res;
    },
    *editAuth({ payload }, { call }) {
      const { id, name, code, content } = payload;
      const res = yield call(api.editAuth, id, name, code, content);
      return res;
    },
    *deleteAuth({ payload }, { call }) {
      const { id } = payload;
      const res = yield call(api.deleteAuth, id);
      return res;
    },
    *dragItem({ payload }, { call }) {
      const { id, parentId, level } = payload;
      const res = yield call(api.dragAuth, id, parentId, level);
      return res;
    },
  },

  reducers: {
    setTypeKey(state,action){
      console.log(action)
      return {
        ...state,
        tabKey: get(action, 'payload'),
      };
    },
    setAuthList(state, action) {
      return {
        ...state,
        authList: get(action, 'payload'),
      };
    },
  },
};

export default Auth;
