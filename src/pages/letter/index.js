/*
 * @Author: 王硕
 * @Date: 2020-03-09 15:52:22
 * @LastEditors: 王硕
 * @LastEditTime: 2020-03-09 17:32:44
 * @Description: file content
 */
import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import styles from './index.less';
import LetterList from '@/components/List/SearchList'

const { TabPane } = Tabs;

const operations = (
  <Button type="primary" style={{ marginRight: '16px' }}>
    新增函件
  </Button>
);

export default class index extends Component {
  constructor(props){
    super(props)
    this.columns = [
      {dataIndex:'name',title:'xxx'}
    ]
  }
  render() {
    return (
      <div className={styles.letter}>
        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="已办（10）" key="1">
            <LetterList columns={this.columns}/>
          </TabPane>
          <TabPane tab="待办（20）" key="2">
            Content of tab 2
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
