/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-07 22:39:26
 * @Description: file content
 */
import { IConfig } from 'umi-types';
// import theme from '@ant-design/aliyun-theme'
const RED = '#e03d3e';

// ref: https://umijs.org/config/
const config: IConfig =  {
  history: 'hash',
  hash: true,
  publicPath: './',
  treeShaking: true,
  proxy: {
    // '/authsys': {
    //   target: 'http://47.113.114.129:3000/authsys',
    //   changeOrigin: true,
    //   pathRewrite: { '^/authsys': '' },
    // },
    // '/sys_inspect': {
    //   target: 'http://47.113.114.129:3000/sys_inspect',
    //   changeOrigin: true,
    //   pathRewrite: { '^/sys_inspect': '' },
    // },
    '/sys_inspect': {
      target: 'http://172.253.60.240:8081/sys_inspect',
      changeOrigin: true,
      pathRewrite: { '^/sys_inspect': '' },
    },
    '/cmonitor': {
      target: 'http://172.253.60.240:8081/cmonitor',
      changeOrigin: true,
      pathRewrite: { '^/cmonitor': '' },
    },
    '/cmsoa': {
      // 对OA相关接口调用
      target: 'http://172.253.40.249:8081',
      changeOrigin: true,
      pathRewrite: { '^/cmsoa': '' },
    },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'Auth',
      links: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: 'favicon.ico'
      }],
      dll: true,
      locale: {
        enable: false,
        // default false
        default: 'zh-CN',
        baseNavigator: true,
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  chainWebpack(config, { webpack }) {
    const isProd = process.env.NODE_ENV === 'production'

    // 修改js文件名
    if (isProd) {
      config.output.filename('prot.[contenthash:8].js')
    } else {
      config.output.filename('prot.js')
    }

    // 修改css文件名
    const cssKey = 'extract-css'
    if (config.plugins.has(cssKey)) {
      if (isProd) {
        config.plugin(cssKey).tap(args => [{
          filename: 'prot.[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].chunk.css'
        }])
      } else {
        config.plugin(cssKey).tap(args => [{
          filename: 'prot.css',
          chunkFilename: '[name].chunk.css'
        }])
      }
    }
  },
  // 使用主题
  theme: {
    'border-radius-base': '2px',
    'primary-color': '#cc9d52',
    'btn-primary-bg': RED,
    'menu-dark-item-active-bg': '#1890FF',
    // 'form-item-margin-bottom': '20px',
    // 'form-component-max-height': '30px',
    'tabs-card-active-color': RED,
    'tabs-active-color': RED,
    'tabs-highlight-color': RED,
    'tabs-ink-bar-color': RED,
    'tabs-hover-color': RED,
    'tabs-horizontal-margin': '0 12px 0 24px',
    'tabs-vertical-padding': '8px 10px 8px 0',
  },
}

export default config;
