/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-05 11:27:58
 * @Description: file content
 */
import { get, post } from '@/utils/request';

// 登录
export const login = ({ oaCode, passwd, imageCode }) => {
  return get('/cmsoa/cms_login/loginService/login', { oaCode, passwd, imageCode });
};

// 获取当前用户
export const current = () => {
  return post('/cmonitor/user/getCurrentUser')
};
