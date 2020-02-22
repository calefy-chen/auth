/*
 * @Author: 王硕
 * @Date: 2020-02-12 14:15:18
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-21 14:48:58
 * @Description: file conte
 */
import React, { Component } from 'react';
import {Form, Spin, Button, message} from 'antd'
import { connect } from 'dva';
import RoleTransfer from '@/components/RoleTransfer';

@connect(
  ({ loading, authAssign, auth }) => ({
    roleLoading: loading.effects['authAssign/getAuthAssignForRole'],
    authData: auth.authList
  }),
  dispatch => ({
    getAuthAssignForRole: payload => dispatch({ type: 'authAssign/getAuthAssignForRole', payload }),
    authAssignToRole: payload => dispatch({ type: 'authAssign/authAssignToRole', payload }),
  }),
)
class toRoleForm extends Component {
  state = { roleData: '' };
  componentDidMount(){
    const { roleId, getAuthAssignForRole } = this.props;
    getAuthAssignForRole(roleId).then(res => {
      this.setState({
        roleData:res.data.map(item => item.toString())
      })
    });
  }
  componentDidUpdate(pre) {
    const { roleId, getAuthAssignForRole } = this.props;
    if(pre.roleId !== roleId && roleId){
      getAuthAssignForRole(roleId).then(res => {
        this.setState({
          roleData:res.data.map(item => item.toString())
        })
      });
    }
  }
  onTransfer = roleData => {
    this.setState({
      roleData,
    });
  };
  handleSubmit = () => {
    const { authAssignToRole, roleId,onEditEnd } = this.props;
    const { roleData } = this.state;
    authAssignToRole({ roleId:roleId, items: roleData.join(',') }).then(res => {
      if (res.code === 200) {
        message.success('处理成功');
        onEditEnd()
      } else {
        message.error(res.message);
      }
    });
  }
  render() {
    const { roleLoading, authData, cancel,roleId } = this.props;
    return (
      <Form>
        <Form.Item>
          <Spin spinning={roleLoading}>
           <RoleTransfer treeData={authData} onTransfer={this.onTransfer} disabledId={roleId}></RoleTransfer>
          </Spin>
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSubmit} loading={roleLoading}>
            提交
          </Button>{' '}
          &emsp;
          <Button onClick={cancel}>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}
export default toRoleForm;
