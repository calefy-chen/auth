/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-05 20:50:14
 * @Description: file content
 */
import { Model } from 'dva';
import get from 'lodash/get';
import * as api from '@/services/project';

const Project: Model = {
  namespace: 'project',

  state: {
    projectList: [],
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

    // 创建/编辑项目
    *editProject({ payload }, { call }) {
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
    setList(state, action) {
      return {
        ...state,
        projectList: get(action, 'payload'),
      };
    },
  },
};

export default Project;
