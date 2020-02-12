/**
 * 封装ajax请求
 */
import { RESPONSE } from '@/utils/constants';
import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import lodashGet from 'lodash/get';
import isString from 'lodash/isString';
import once from 'lodash/once';
import { timeString } from './utils';

// 服务器要求的请求头添加
//   NOTE: 其他token等信息都放到了cookie中，因此无需写在头中（为了支持直接下载场景）
export function getHeaders() {
  return {
    'msg.callback': '',
  };
}

// 从全局获取oaCode，无值则返回unknown
function getOaCode() {
  return lodashGet(window, 'CMS_OA_CODE', 'unknown');
}

// 获取唯一标识
function sequence(key: string) {
  return [key, Date.now(), Math.round(Math.random() * 10000)].join('_');
}

// 记录前端统计接口请求日志
const logs = {};

// 记录一次用户浏览器情况，添加到日志中
const userBrowser = once(() => {
  const key = 'userBrowser';
  const oaCode = getOaCode();
  logs[key] = {
    endTime: Date.now(), // NOTE: 临时用该值判断是否需要发送到服务器
    url: key,
    sequence: sequence(oaCode),
    oaCode,
    type: 'browser',
    content: [
      `screen: ${screen.width}x${screen.height}`,
      `window: ${window.innerWidth}x${window.innerHeight}`,
      navigator.userAgent,
    ].join('|'),
  };
});

const sendLogs = debounce(() => {
  userBrowser(); // 添加统计浏览器情况（放在这里方便获取oaCode）
  const list = filter(logs, 'endTime');
  if (list.length) {
    axios.post(
      '/cmonitor/message/insertRequestLog',
      list.map((log) => {
        delete logs[log.url];
        return {
          requestUrl: log.url,
          sequence: log.sequence,
          oaCode: log.oaCode,
          type: log.type || 'api',
          duration: log.duration,
          content: JSON.stringify(log),
        };
      }),
    );
  }
}, 2000);

// 添加日志记录，只有非发送日志的接口，超过500ms返回的才统计上去
function addLog(key: string, data: object) {
  if (/insertRequestLog/.test(key)) {
    return;
  }
  const log = { ...logs[key], ...data };
  logs[key] = log;
  if (log.endTime) {
    const format = 'YYYY-MM-DD HH:mm:ss.SSS';
    log.duration = log.endTime - log.startTime;
    if (log.responseStatus === 200 && log.duration < 500) {
      // 500ms内接口正常，不记录日志(非200的还是要记录)
      delete logs[key];
    } else {
      log.startTime = timeString(log.startTime, format);
      log.endTime = timeString(log.endTime, format);
    }
  }

  sendLogs();
}

// request拦截器, 每次发起请求时才获取并填充token
axios.interceptors.request.use((options: AxiosRequestConfig) => {
  // 为url添加sequence参数，并记录接口情况
  const oaCode = getOaCode();
  const seq = sequence(oaCode);
  let { url } = options;
  url = `${url}${/\?/.test(url) ? '&' : '?'}_sqs=${seq}`;
  addLog(url, {
    url,
    sequence: seq,
    startTime: Date.now(),
    requestData: isString(options.data) ? options.data : JSON.stringify(options.data),
    oaCode,
  });
  // 外部跨域接口不能带上微服务头，否则会报错跨域
  if (/qt\.gtimg\.cn/.test(options.url)) {
    return { ...options, url };
  }
  return {
    ...options,
    url,
    headers: { ...options.headers, ...getHeaders(), 'msg.sequence': seq },
  };
});

// 统一错误处理
axios.interceptors.response.use((response: AxiosResponse) => {
  const res = response.data;
  addLog(response.config.url, {
    url: response.config.url,
    endTime: Date.now(), // timeString(undefined, 'YYYY-MM-DD HH:mm:ss.SSS'),
    responseStatus: response.status,
    responseStatusText: response.statusText || '',
    responseDataStatus: (res && (res.code || res.status)) || '',
    responseDataMessage: (res && (res.message || res.errorMsg)) || '',
  });
  if (res && (res.code <= RESPONSE.FAILURE || res.status === '01') && res.success !== true) {
    let msg = res.message || res.errorMsg || '请求异常';
    if (/checkPassword/.test(response.config.url || '') && msg === 'failed') {
      // 验证集中交易柜台密码
      msg = '验证未通过';
    }
    message.error(`${msg}`);
  }
  return response;
});

function axiosRequest(config: AxiosRequestConfig) {
  return axios(config)
    .then((res: AxiosResponse) => res.data) // 从Response摘取实际返回值
    .catch((err: AxiosError) => { // 组装错误消息数据为前端识别格式
      if (err.response) {
        return err.response.data || {
          code: 0,
          status: err.response.status,
          message: err.response.statusText
        }
      } else {
        return {
          code: 0,
          message: err.message
        }
      }
    })
}

export function get(url: string, params?: object, config?: AxiosRequestConfig) {
  return axiosRequest({
    ...config,
    url,
    method: 'GET',
    params: {
      // _: Date.now(), // 防止IE在GET请求时缓存
      ...params
    }
  })
}

export function post(url: string, data?: object, config?: AxiosRequestConfig) {
  return axiosRequest({
    ...config,
    url,
    method: 'POST',
    // data: qs.stringify(data)
    data: data
  })
}
