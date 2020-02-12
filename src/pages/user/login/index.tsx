/**
 * 登录页
 */
import React, { useCallback } from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import { Form, Button, Input, Icon } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './index.less';
import logo from '@/assets/logo.png';

// 登录上传参数
interface LoginParams {
  username: string;
  password: string;
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
        if (res) {
          router.push('/system/2001');
        }
      });
    });
  }, []);

  // 渲染表单
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>统一运维监控</span>
            </Link>
          </div>
          <div className={styles.desc}>
            {/* 故障管理系统 */}
          </div>
        </div>
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
            <Button type="primary" htmlType="submit" block loading={loginLoading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
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
