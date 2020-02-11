/*
 * @Author: 王硕
 * @Date: 2020-02-05 15:19:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-07 23:30:31
 * @Description: file content
 */
import { get, post } from '@/utils/request';
// 获取权限项全量列表
export const getAuthList = (projectId: string) => {
  return get('/authsys/authItems/list', { projectId });
};
export const addAuth = (
  projectId: string,
  type: string,
  parentId: string,
  name: string,
  code: string,
  content: string,
) => {
  return post('/authsys/authItems/create', { projectId, type, parentId, name, code, content });
};
export const editAuth = (id: string, name: string, code: string, content: string) => {
  return post('/authsys/authItems/update', { id, name, code, content });
};
export const deleteAuth = (id: string) => {
  return post('/authsys/authItems/delete', { id });
};
// 拖动编辑层级与父级
export const dragAuth = (id: string, parentId: string, level: string) => {
  return post('/authsys/authitems/updatePosition', { id, parentId, level });
};
