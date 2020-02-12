/*
 * @Author: 王硕
 * @Date: 2020-02-05 15:19:25
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-12 18:42:57
 * @Description: file content
 */
/**
 * 项目详情页
 */
import React, { Component } from 'react';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { connect } from 'dva';
import Role from './role';
import Permission from './permission';
import Menu from './menu';
import isEmpty from 'lodash/isEmpty'

const { TabPane } = Tabs;
@connect(
  ({ project, auth, loading }) => ({
    detailData: project.projectDetail,
    authList: auth.authList,
    loading: loading.effects['auth/getAuthList'],
  }),
  dispatch => ({
    fetchDetail: payload => dispatch({ type: 'project/getProjectDetail', payload }),
    fetchAuthList: payload => dispatch({ type: 'auth/getAuthList', payload }),
    getTypeKey: payload => dispatch({ type: 'auth/getTypeKey', payload }),
  }),
)
class index extends Component {
  componentDidMount() {
    const {
      fetchDetail,
      fetchAuthList,
      match: { params },
    } = this.props;
    fetchDetail(params.projectId);
    fetchAuthList(params.projectId);
  }
  tabChange = key => {
    const { getTypeKey } = this.props;
    getTypeKey(key);
    console.log(key);
  };
  render() {
    const { detailData,authList } = this.props;
    return (
      <div>
        <Breadcrumb separator="/">
          <Breadcrumb.Item href="/#/projects">
            <span style={{fontSize:14,fontWeight:500}}>项目列表</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span style={{fontSize:14,fontWeight:500}}>{detailData.name}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="role" onChange={this.tabChange} size="large">
          <TabPane tab="角色" key="role">
            {isEmpty(authList) ? <Spin /> : <Role />}
          </TabPane>
          <TabPane tab="菜单" key="route">
            {isEmpty(authList)  ? <Spin /> : <Menu />}
          </TabPane>
          <TabPane tab="权限" key="permission">
            {isEmpty(authList)  ? <Spin /> : <Permission />}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default index;
