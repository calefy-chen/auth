/*
 * @Author: 林骏宏
 * @Date: 2020-02-07 10:55:39
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-07 18:27:58
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
import logo from '@/assets/logo.png';

const { Sider } = Layout
const theme = 'light'

@connect(
  ({ system }) => ({
    alarmBigList: system.alarmBigList,
  }),
  dispatch => ({
    getDataType: () => dispatch({ type: 'system/queryDictByDictId' }), // 查询系统类型、预警大类、预警细类
  })
)
class SiderMenu extends PureComponent {
  componentDidMount() {
    const { getDataType } = this.props;
    getDataType();
  }
  
  render() {
    const { alarmBigList, location: { pathname }, } = this.props
    const selectedKeys = pathname
    return (
      <Sider
        trigger={null}
        breakpoint="lg"
        width={180}
        theme={theme}
        className="MenuSider"
      >
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <Menu
          key="Menu"
          mode="inline"
          theme={theme}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{ width: '100%', flex: 1, overflow: 'auto', overflowX: 'hidden' }}
        >
          {alarmBigList.map(item => (
            <Menu.Item key={`/system/${item.value}`}>
              <Link
                to={`/system/${item.value}`}
              >
                <Icon style={{fontSize: 14}} type="clock-circle" />
                <span>{item.name}</span>
              </Link>
            </Menu.Item>
          ))}
          {/* <Menu.Item key="1">
            <Icon style={{fontSize: 14}} type="clock-circle" />
            <span>访问延时警告</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon style={{fontSize: 14}} type="fund" />
            <span>节点连通性</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon style={{fontSize: 14}} type="carry-out" />
            <span>程序异常</span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon style={{fontSize: 14}} type="container" />
            <span>数据异常</span>
          </Menu.Item>
          <Menu.Item key="5">
            <Icon style={{fontSize: 14}} type="database" />
            <span>调度异常</span>
          </Menu.Item> */}
        </Menu>
      </Sider>
    )
  }
}

export default SiderMenu;