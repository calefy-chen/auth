/*
 * @Author: 王硕
 * @Date: 2020-02-11 05:10:37
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-11 07:16:08
 * @Description: file content
 */
import { get, post } from '@/utils/request';

export const authAssignToRole = (roleId: string, items: string) => {
  return post('/authsys/authAssign/toRole', { roleId, items })
};
export const getAuthAssignForRole = (roleId: string) => {
  return get('/authsys/authAssign/forRole', { roleId})
};
export const getAssignedToWho = (itemId: string) => {
  return get('/authsys/authAssign/assignedToWho', { itemId})
};
