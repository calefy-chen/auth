/*
 * @Author: 王硕
 * @Date: 2020-02-05 15:19:25
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-20 16:17:51
 * @Description: file content
 */
/**
 * 项目详情页
 */
import React, { Component } from 'react';
import router from 'umi/router';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { connect } from 'dva';
import Role from './role';
import Permission from './permission';
import Menu from './menu';
import User from './user';
import isEmpty from 'lodash/isEmpty';

const { TabPane } = Tabs;
@connect(
  ({ project, auth, loading }) => ({
    detailData: project.projectDetail,
    authList: auth.authList,
    tabKey: auth.tabKey,
    loading: loading.effects['auth/getAuthList'],
  }),
  dispatch => ({
    clearData: () => dispatch({ type: 'auth/clearData' }),
    fetchDetail: payload => dispatch({ type: 'project/getProjectDetail', payload }),
    fetchAuthList: payload => dispatch({ type: 'auth/getAuthList', payload }),
    setTypeKey: payload => dispatch({ type: 'auth/setTypeKey', payload }),
  }),
)
class index extends Component {
  componentDidMount() {
    const {
      fetchDetail,
      fetchAuthList,
      match: { params },
    } = this.props;
    fetchDetail(params.projectId).then(res => {
      if (res.data) {
        fetchAuthList(res.data.id);
      }
      if(!res.data && res.code === 200){
        router.push('/error');
      }
    });
  }
  componentWillUnmount() {
    const { clearData } = this.props;
    clearData();
  }
  tabChange = key => {
    const { setTypeKey } = this.props;
    setTypeKey(key);
  };
  render() {
    const { detailData, authList, tabKey } = this.props;
    return (
      <div>
        <Breadcrumb separator="/">
          <Breadcrumb.Item href="/#/projects">
            <span style={{ fontSize: 14, fontWeight: 500 }}>项目列表</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{detailData.name}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="role" onChange={this.tabChange} size="large">
          <TabPane tab="角色" key="role">
            {isEmpty(authList) ? <Spin /> : <Role />}
          </TabPane>
          <TabPane tab="菜单" key="route">
            {isEmpty(authList) ? <Spin /> : <Menu />}
          </TabPane>
          <TabPane tab="权限" key="permission">
            {isEmpty(authList) ? <Spin /> : <Permission />}
          </TabPane>
          <TabPane tab="人员" key="user">
            {tabKey === 'user' ? <User /> : null}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default index;
