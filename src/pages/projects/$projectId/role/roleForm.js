/*
 * @Author: 王硕
 * @Date: 2020-02-10 13:42:19
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-12 16:04:13
 * @Description: file content
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, message, TreeSelect } from 'antd';
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
    addAuth: payload => dispatch({ type: 'auth/addAuth', payload })
  }),
)
@Form.create()
class perForm extends Component {
  state = {
    selectVal: null
  };

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
      onEditEnd
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
      form: { getFieldDecorator },
      submitLoading,
    } = this.props;
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('name', {
            initialValue: roleDetail.name || '',
            rules: [{ required: true, message: '请输入名称' }],
          })(<Input placeholder="请输入名称" />)}
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
