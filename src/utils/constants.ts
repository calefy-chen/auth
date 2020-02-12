/**
 * 请求返回数据状态是否成功
 *   返回格式为：{code: 1, data: ..., message: ''}
 *   code=1 成功；code=0 失败
 */
export const enum RESPONSE {
  FAILURE = 0,
  SUCCESS = 1,
}

// 权限系统中本系统标识
export const AUTH_SYSTEM_FLAG = 'CMonitor'
