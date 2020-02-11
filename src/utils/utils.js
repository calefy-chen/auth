import moment from './moment';
import JSEncrypt from 'jsencrypt';
import trim from 'lodash/trim';

/**
 * 日期转换字符串 2018/6/22 15:30
 */
export function timeString(t, format = 'YYYY/MM/DD HH:mm') {
  if (!t) {
    return '';
  }
  return moment(t).format(format);
}

/**
 * 设置cookie
 */
export const setCookie = config => {
  const option = { ...config };
  if (!option.domain) {
    option.domain = document.domain;
  }
  if (!option.path) {
    option.path = '/';
  }
  // 如果未定义过期时间，则设置一周有效
  if (option.expires === undefined) {
    const date = new Date(); // 获取当前时间
    date.setTime(date.getTime() + 7 * 24 * 3600 * 1000); // 格式化为cookie识别的时间
    option.expires = date.toGMTString();
  }

  let str = '';
  Object.keys(option).map(key => {
    str += `${key}=${option[key]};`; // 设置cookie
    return key;
  });
  document.cookie = str;
};
/**
 * 获取cookie
 */
export const getCookie = () => {
  const obj = {};
  document.cookie.split(';').forEach(option => {
    const arr = option.split('=');
    const key = trim(arr[0]);
    const value = arr[1];
    if (key && value) {
      obj[key] = value;
    }
  });
  return obj;
};

// 设置登录认证状态cookie
export function setAuthCookie(token) {
  // TODO: 解决cookie被域名切换后退出时设置错误问题，下次上线时可删掉
  document.cookie = `auth.token=;path=/;expires=${new Date(0).toGMTString()};`;

  setCookie({ 'auth.token': token });
}

/**
 *  RSA 非对称加密
 */
export const rsaEncrypt = unencrypted => {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(`
        -----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO0ZcFaCDKJ3Wx4mu8XDSzRNBv
        9/NYSvxv+bbX6/HDtFCeNQwJObb7+z7oEZBjeRXQzhr+Pcok1+o1oWB+aRwPS351
        btm3fyQFq5ytfKrZcN5G0p+DgAEmiCbhFGAa5EQ/RumUud+Y/wYj+C/QKPmoLR30
        JAhVk8+97wE7DX/plQIDAQAB
        -----END PUBLIC KEY-----
    `);
  return jsEncrypt.encrypt(unencrypted);
};
