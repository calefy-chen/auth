import { projectList } from './../services/project';
/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-09 19:52:40
 * @Description: file content
 */
import { Model } from 'dva';
import get from 'lodash/get';
import * as api from '@/services/project';

const Project: Model = {
  namespace: 'project',

  state: {
    projectList: [],
    projectDetail:'',
  },

  effects: {
    // 项目列表
    *getProjectList(_, { call, put }) {
      const res = yield call(api.projectList);
      if (res && res.data) {
        yield put({ type: 'setList', payload: res.data });
      }
      return res;
    },
    // 项目列表
    *getProjectDetail({payload}, { call, put }) {
      const res = yield call(api.projectDetail,payload);
      if (res && res.data) {
        yield put({ type: 'setDetail', payload: res.data });
      }
      return res;
    },

    // 创建/编辑项目
    *submitProject({ payload }, { call }) {
      const { id, name, code, content } = payload;
      let res
      if(id) {
        res = yield call(api.updateProject, id, name, code, content);
      } else {
        res = yield call(api.creatProject, name, code, content);
      }
      return res;
    },

    // 删除项目
    *delProject({ payload }, { call }) {
      const { id } = payload;
      const res = yield call(api.delProject, id);
      return res;
    },
  },

  reducers: {
    setProjectId(state, action){
      return {
        ...state,
        projectId: get(action, 'payload'),
      };
    },
    setList(state, action) {
      return {
        ...state,
        projectList: get(action, 'payload'),
      };
    },
    setDetail(state,action){
      return {
        ...state,
        projectDetail: get(action, 'payload'),
      };
    }
  },
};

export default Project;
