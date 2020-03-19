/*
 * @Author: 王硕
 * @Date: 2020-03-09 15:52:22
 * @LastEditors: 王硕
 * @LastEditTime: 2020-03-09 17:32:44
 * @Description: file content
 */
import React, { Component } from 'react';
import { Button, DatePicker, Input, Menu } from 'antd';
import moment from 'moment';
import styles from './index.less';
import LetterList from '@/components/List/SearchList';

const { Search } = Input;
const { RangePicker } = DatePicker;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.columns = [{ dataIndex: 'name', title: 'xxx' }];
  }

  state = {
    current: '0',
  };

  onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  handleAddLetter = () =>{

  }

  render() {
    return (
      <div className={styles.letter}>
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="0">已办（10）</Menu.Item>
          <Menu.Item key="1">待办（20）</Menu.Item>
        </Menu>
        <Button type="primary" style={{position:"absolute",right:'16px',top:'8px'}} onClick={this.handleAddLetter}>新增函件</Button>
        <div className={styles.filter}>
          <Search
            placeholder="请输入客户名称/资金账户/营业部/函件名称"
            onSearch={value => console.log(value)}
            style={{ width: 336 }}
          />
          <RangePicker
            ranges={{
              本月: [moment().startOf('month'), moment().endOf('month')],
              本周: [moment().startOf('week'), moment().endOf('week')],
            }}
            onChange={() => this.onChange}
          />
        </div>
        <div className={styles.letterList}>
          <LetterList columns={this.columns} />
        </div>
      </div>
    );
  }
}
