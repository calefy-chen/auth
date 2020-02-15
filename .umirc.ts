/*
 * @Author: 林骏宏
 * @Date: 2020-02-04 12:07:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-13 11:00:39
 * @Description: file content
 */
import { IConfig } from 'umi-types';
import theme from '@ant-design/aliyun-theme'

// ref: https://umijs.org/config/
const config: IConfig =  {
  history: 'hash',
  hash: true,
  publicPath: './',
  treeShaking: true,
  proxy: {
    '/authsys': {
      target: 'http://47.113.114.129:3000/authsys',
      changeOrigin: true,
      pathRewrite: { '^/authsys': '' },
    },
    '/api': {
      target: 'http://47.113.114.129:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    }
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
  cssLoaderOptions:{
    localIdentName:'[local]'
  },
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
  theme,
}

export default config;
