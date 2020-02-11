/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-07 15:48:58
 * @Description: file content
 */
import { get, post } from '@/utils/request';

// 项目列表
export const projectList = () => {
  return get('/authsys/projects/list')
};

// 项目列表
export const projectDetail = (id: string) => {
  return get('/authsys/projects/detail',{id})
};

// 添加项目
export const creatProject = (name: string, code: string, content: string) => {
  return post('/authsys/projects/create', { name, code, content })
};

// 编辑项目
export const updateProject = (id: string, name: string, code: string, content: string) => {
  return post('/authsys/projects/update', { id, name, code, content })
};

// 删除项目
export const delProject = (id: string) => {
  return post('/authsys/projects/delete', { id })
};

// 排序
export const updatePosition = (id: string, parentId: string, level: string, content: string) => {
  return post('/authsys/projects/update', { id, parentId, level })
};
