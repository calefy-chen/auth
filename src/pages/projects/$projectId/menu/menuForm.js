/*
 * @Author: 王硕
 * @Date: 2020-02-07 21:08:40
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-17 15:31:40
 * @Description: file content
 */
import React, { Component } from 'react'
import { connect } from 'dva';
import { Form, Button, Input, message } from 'antd';

@connect(({ loading,project,auth }) => ({
  Loading: loading.effects['auth/addAuth'] || loading.effects['auth/editAuth'],
  projectDetail:project.projectDetail,
  type:auth.tabKey
}),
dispatch => ({
  editAuth: (payload) => dispatch({ type: 'auth/editAuth', payload }),
  addAuth:(payload) => dispatch({ type: 'auth/addAuth', payload }),
}),)

@Form.create()
class perForm extends Component {
  componentDidUpdate(prevProps) {
    const { menuDetail,form:{resetFields} } = this.props;
    if (prevProps.menuDetail !== menuDetail) {
      resetFields()
    }
  }
  handleSubmit = (e) =>{
    const {projectDetail,parentId,type,form:{ validateFields},menuDetail,addAuth,editAuth,onEditEnd } = this.props;
    validateFields((errors, values) => {
      if (errors) return;
      let parmas = { ...values }
      if(menuDetail.id){
        parmas.id = menuDetail.id
        editAuth(parmas).then(res => {
        if (res.code === 200) {
          message.success('处理成功');
          onEditEnd()
        }else{
          message.error(res.message);
        }
      })
      }else{
        parmas.projectId = projectDetail.id
        parmas.type = type
        parmas.parentId = parentId
        addAuth(parmas).then(res => {
          if (res.code === 200) {
            message.success('处理成功');
            onEditEnd()
          }else{
            message.error(res.message);
          }
        })
      }
    });
  }
  render() {
    const {cancel,menuDetail,form:{ getFieldDecorator},Loading } = this.props;
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
      <Form.Item label="菜单名称" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        {getFieldDecorator('name', {
          initialValue: menuDetail.name || '',
          rules: [{ required: true, message: '请输入名称' }],
        })(<Input placeholder="请输入名称" />)}
      </Form.Item>

      <Form.Item label="路由" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        {getFieldDecorator('code', {
          initialValue: menuDetail.code || '',
          rules: [{ required: true, message: '请输入路由' }],
        })(<Input placeholder="请输入路由" />)}
      </Form.Item>

      <Form.Item label="其他" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        {getFieldDecorator('content', {
          initialValue: menuDetail.content || '',
          rules: [{ max: 500, message: '长度不超过500个字符' },],
        })(<Input.TextArea placeholder={`请输入其他`} rows={4} style={{ marginTop: 5 }} />)}
      </Form.Item>

      <Form.Item wrapperCol={{ span: 18, offset: 4 }} style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={this.handleSubmit} loading={Loading}>
          提交
        </Button>{' '}
        &emsp;
        <Button onClick={cancel}>取消</Button>
      </Form.Item>
    </Form>
    )
  }
}
export default perForm
