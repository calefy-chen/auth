/*
 * @Author: 王硕
 * @Date: 2020-02-11 05:10:37
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-17 14:57:26
 * @Description: file content
 */
import { get, post } from '@/utils/request';

export const authAssignToRole = (roleId: string, items: string) => {
  return post('/authsys/authAssign/toRole', { roleId, items })
};
export const authAssignToUser = (projectId:string,userId: string,userName:string,orgId:string, items: string) => {
  return post('/authsys/authAssign/toUser', {projectId, userId, userName, orgId, items})
};
export const getAuthAssignForRole = (roleId: string) => {
  return get('/authsys/authAssign/forRole', { roleId})
};
export const getAuthAssignForUser = (userId: string,projectId: string) => {
  return get('/authsys/authAssign/forUser', { userId,projectId})
};
export const getAssignedToWho = (itemId: string) => {
  return get('/authsys/authAssign/assignedToWho', { itemId})
};
export const queryBranchVo = () => {
  return get('/cmonitor/admin/queryBranchVo')
};
export const getOaList = () => {
  return get('/cmsoa/uuv/org/list')
};
export const getSelfDept = () => {
  return get('/cmsoa/uuv/org/selfDept')
};
export const getByOrgId = (orgId:string) => {
  return get('/cmsoa/uuv/user/byOrgId',{orgId})
};
export const searchUser = (keyword:string) => {
  return get('/cmsoa/uuv/addressBook/searchUser',{keyword})
};
