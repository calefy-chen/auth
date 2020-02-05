/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-05 14:25:21
 * @Description: file content
 */
import { get, post } from '@/utils/request';

// 项目列表
export const projectList = (account: string, passwd: string) => {
  return get('/authsys/projects/list')
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
