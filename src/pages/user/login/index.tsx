/**
 * 登录页
 */
import React, { useCallback } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Form, Button, Input, Icon, Checkbox } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './index.css';

// 登录上传参数
interface LoginParams {
  username: string;
  password: string;
  remember: boolean;
}

// 登录组件接收到的props
interface LoginProps {
  loginLoading: boolean;
  form: WrappedFormUtils;
  login(payload: LoginParams): Promise<any>;
}

/**
 * 登录组件
 */
const Login = ({
  loginLoading,
  login,
  form: { getFieldDecorator, validateFields },
}: LoginProps) => {
  // 执行登录
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) return;
      login(values).then(res => {
        if (res.code === 200) {
          router.push('/');
        }
      });
    });
  }, []);

  // 渲染表单
  return (
    <Form onSubmit={handleSubmit} className={styles.loginForm}>
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
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>记住我</Checkbox>)}

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
  }),
)(Form.create()(Login));
