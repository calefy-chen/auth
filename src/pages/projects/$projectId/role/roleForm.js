/*
 * @Author: 王硕
 * @Date: 2020-02-10 13:42:19
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-11 09:18:56
 * @Description: file content
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, message, TreeSelect, Spin } from 'antd';
import RoleTransfer from '@/components/RoleTransfer';
const { TreeNode } = TreeSelect;
@connect(
  ({ loading, project, auth }) => ({
    roleLoading: loading.effects['authAssign/getAuthAssignForRole'],
    submitLoading: loading.effects['auth/submitAuth'],
    authData: auth.authList,
    projectDetail: project.projectDetail,
    type: auth.tabKey,
  }),
  dispatch => ({
    editAuth: payload => dispatch({ type: 'auth/editAuth', payload }),
    addAuth: payload => dispatch({ type: 'auth/addAuth', payload }),
    getAuthAssignForRole: payload => dispatch({ type: 'authAssign/getAuthAssignForRole', payload }),
    authAssignToRole: payload => dispatch({type:'authAssign/authAssignToRole',payload})
  }),
)
@Form.create()
class perForm extends Component {
  state = {
    selectVal: null,
    roleData:''
  };
  componentDidMount(){
    const {roleDetail,getAuthAssignForRole} = this.props
    if(roleDetail.id){
      getAuthAssignForRole(roleDetail.id)
    }
  }
  componentDidUpdate(prevProps) {
    const {
      roleDetail,
      form: { resetFields },
    } = this.props;
    if (prevProps.roleDetail !== roleDetail) {
      resetFields();
    }
  }
  handleSubmit = e => {
    const {
      projectDetail,
      parentId,
      type,
      form: { validateFields },
      roleDetail,
      addAuth,
      editAuth,
      onEditEnd,
      authAssignToRole
    } = this.props;
    const {roleData} = this.state
    validateFields((errors, values) => {
      if (errors) return;
      let parmas = { ...values };
      if (roleDetail.id) {
        parmas.id = roleDetail.id;
        editAuth(parmas).then(res => {
          if (res.code === 200) {
            message.success('处理成功');
            onEditEnd();
          } else {
            message.error(res.message);
          }
        });
        authAssignToRole({roleId:roleDetail.id,items:roleData.join(',')}).then(res => {
          if (res.code === 200) {
            message.success('处理成功');
            onEditEnd();
          } else {
            message.error(res.message);
          }
        })
      } else {
        parmas.projectId = projectDetail.id;
        parmas.type = type;
        parmas.parentId = parentId;
        addAuth(parmas).then(res => {
          if (res.code === 200) {
            message.success('处理成功');
            onEditEnd();
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };
  onTransfer = (roleData) => {
    this.setState({
      roleData
    })
  }
  handelSelect = value => {
    const { getAuthAssignForRole } = this.props;
    this.setState({ selectVal: value });
    getAuthAssignForRole(value);
  };
  renderTree = data => {
    console.log('树形菜单数据源', data);
    return data.map(item => {
      if (!item.children) {
        return <TreeNode title={item.name} key={item.id} value={item.id} />;
      } else {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
    });
  };
  render() {
    const {
      cancel,
      roleDetail,
      authData,
      roleLoading,
      form: { getFieldDecorator },
      submitLoading,
    } = this.props;
    const { selectVal } = this.state;
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('name', {
            initialValue: roleDetail.name || '',
            rules: [{ required: true, message: '请输入权限名称' }],
          })(<Input placeholder="请输入权限名称" />)}
        </Form.Item>

        <Form.Item label="标识" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('code', {
            initialValue: roleDetail.code || '',
            rules: [{ required: true, message: '请输入标识' }],
          })(<Input placeholder="请输入标识" />)}
        </Form.Item>

        <Form.Item label="描述" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('content', {
            initialValue: roleDetail.content || '',
            rules: [{ max: 500, message: '长度不超过500个字符' }],
          })(<Input.TextArea placeholder={`请输入描述`} rows={4} style={{ marginTop: 5 }} />)}
        </Form.Item>
        {roleDetail.id ? (
          <>
            <Form.Item label="选择角色" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
              <TreeSelect
                style={{ width: '100%' }}
                value={selectVal}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="选择角色"
                treeDefaultExpandAll
                onChange={this.handelSelect}
              >
                {this.renderTree(authData['role'])}
              </TreeSelect>
            </Form.Item>
            <Form.Item label="权限分配" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
              {roleLoading ? <Spin /> : <RoleTransfer treeData={authData} onTransfer={this.onTransfer}></RoleTransfer>}
            </Form.Item>
          </>
        ) : null}

        <Form.Item wrapperCol={{ span: 18, offset: 4 }} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSubmit} loading={submitLoading}>
            提交
          </Button>{' '}
          &emsp;
          <Button onClick={cancel}>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}
export default perForm;
