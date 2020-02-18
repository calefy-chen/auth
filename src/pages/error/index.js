/*
 * @Author: 王硕
 * @Date: 2020-02-18 14:57:25
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-18 15:04:22
 * @Description: file content
 */
import React, { Component } from 'react';
import { Result, Button } from 'antd';
import Link from 'umi/link';

export default class index extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Result
          status="error"
          title="该项目不存在!"
          extra={
            <Button type="primary">
              <Link to="/">返回首页</Link>
            </Button>
          }
        />
      </div>
    );
  }
}
