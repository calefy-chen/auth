/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-14 20:51:37
 * @Description: file content
 */
import { Model } from 'dva';
import get from 'lodash/get';
import * as api from '@/services/authAssign';

const authAssign: Model = {
  namespace: 'authAssign',

  state: {
    forRoleData: [],
    forUserData:[],
    toWhoData: {},
    branchVo: [],
    userMsg: [],
    addUserMsg:[],
    addressList:[]
  },

  effects: {
    *searchUser({ payload }, { call }) {
      const { keyword } = payload;
      console.log(keyword, 'keyword');
      const res = yield call(api.searchUser, keyword);
      return res;
    },
    *authAssignToRole({ payload }, { call }) {
      const { roleId, items } = payload;
      const res = yield call(api.authAssignToRole, roleId, items);
      return res;
    },
    *authAssignToUser({ payload }, { call }) {
      const { projectId, userId, userName, orgId, items } = payload;
      console.log(payload,'authAssign/authAssignToUser')
      const res = yield call(api.authAssignToUser, projectId, userId, userName, orgId, items);
      return res;
    },
    *getAuthAssignForRole({ payload }, { call, put }) {
      const res = yield call(api.getAuthAssignForRole, payload);
      if (res && res.data) {
        yield put({ type: 'setAuthAssignForRole', payload: res.data });
      }
      return res;
    },
    *getAuthAssignForUser({ payload }, { call, put }) {
      const {userId,projectId} = payload
      const res = yield call(api.getAuthAssignForUser, userId,projectId);
      if (res && res.data) {
        yield put({ type: 'setAuthAssignForUser', payload: res.data });
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
    *queryBranchVo({ payload }, { call, put }) {
      const res = yield call(api.queryBranchVo, payload);
      if (res && res.data) {
        yield put({ type: 'setBranchVo', payload: res.data });
      }
      return res;
    },
    *getAddressList({ payload }, { call, put }) {
      const res_1 = yield call(api.getOaList);
      const res_2 = yield call(api.getSelfDept);
      const res = res_1.data.concat(res_2.data)
      console.log(res)
      yield put({ type: 'setAddressList', payload: res });
      return res;
    },
    *getByOrgId({ payload }, { call, put }) {
      const { orgId,isAddress } = payload;
      console.log(orgId, 'orgId');
      const res = yield call(api.getByOrgId, orgId[0]);
      if (res && res.data) {
        if(isAddress){
          yield put({ type: 'setAddByOrgId', payload: res.data });
        }else{
          yield put({ type: 'setByOrgId', payload: res.data });
        }

        // 通讯录用户数据

      }
      return res;
    },
  },

  reducers: {
    setAuthAssignForRole(state, action) {
      return {
        ...state,
        forRoleData: get(action, 'payload').map((item: { toString: () => any }) => {
          return item.toString();
        }),
      };
    },
    setAuthAssignForUser(state, action) {
      return {
        ...state,
        forUserData: get(action, 'payload').map((item: { toString: () => any }) => {
          return item.toString();
        }),
      };
    },
    setAssignedToWho(state, action) {
      return {
        ...state,
        toWhoData: get(action, 'payload'),
      };
    },
    setBranchVo(state, action) {
      return {
        ...state,
        branchVo: get(action, 'payload'),
      };
    },
    setByOrgId(state, action) {
      return {
        ...state,
        userMsg: get(action, 'payload'),
      };
    },
    setAddByOrgId(state, action) {
      return {
        ...state,
        addUserMsg: get(action, 'payload'),
      };
    },
    setAddressList(state,action){
      return {
        ...state,
        addressList: get(action, 'payload'),
      };
    }
  },
};

export default authAssign;
