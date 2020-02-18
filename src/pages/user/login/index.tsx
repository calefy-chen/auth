/**
 * 登录页
 */
import React, { useCallback } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Form, Button, Input, Icon, Checkbox } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Cookies from 'js-cookie'
import styles from './index.css';

// 登录上传参数
interface LoginParams {
  username: string;
  password: string;
}

// 登录组件接收到的props
interface LoginProps {
  loginLoading: boolean;
  form: WrappedFormUtils;
  fetchCurrent(): Promise<any>;
  login(payload: LoginParams): Promise<any>;
}

/**
 * 登录组件
 */
const Login = ({
  loginLoading,
  login,
  fetchCurrent,
  form: { getFieldDecorator, validateFields },
}: LoginProps) => {
  // 执行登录
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) return;
      login(values).then(res => {
        if (res.code === 200) {
          Cookies.set('auth.token',res.data.token)
          fetchCurrent()
        }
      }).then(u => {
        router.push('/');
      });
    });
  }, []);

  // 渲染表单
  return (
    <Form onSubmit={handleSubmit} className={styles.loginForm}>
      <h1 style={{textAlign:'center',marginTop:'-40px',transform:'translateY(-60px)',position:'relative'}}>权限管理系统</h1>
      <Form.Item label="账号">
        {getFieldDecorator('account', {
          rules: [{ required: true, message: '请输入账号' }],
        })(<Input prefix={<Icon type="user" />} placeholder="请输入账号" />)}
      </Form.Item>

      <Form.Item label="密码">
        {getFieldDecorator('passwd', {
          rules: [{ required: true, message: '请输入密码' }],
        })(<Input prefix={<Icon type="lock" />} placeholder="请输入密码" type="password" />)}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loginLoading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ loading }: any) => ({
    loginLoading: loading.effects['user/login'],
  }),
  dispatch => ({
    login: (payload: LoginParams) => dispatch({ type: 'user/login', payload }),
    fetchCurrent: () => dispatch({ type: 'user/current' }),
  }),
)(Form.create()(Login));
