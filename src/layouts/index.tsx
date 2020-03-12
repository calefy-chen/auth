import React, { useMemo, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { RouteProps } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import { Spin, Layout  } from 'antd';
import Header from '@/components/Header';

const { Content } = Layout;

interface BasicLayoutProps extends RouteProps {
  user: any;
  userLoading: boolean;
  fetchCurrent(): Promise<any>;
}

// 不需要登录的url列表
const NO_NEED_LOGINS = ['/user/login'];

const BasicLayout = ({ user, userLoading, location, children, fetchCurrent }: BasicLayoutProps) => {
  // 是否不需要登录
  const noNeedLogin = useMemo(() => NO_NEED_LOGINS.indexOf(location?.pathname || '') >= 0, [
    location,
  ]);

  // 需要登录时，获取当前登录用户，获取失败时跳转
  useEffect(() => {
    // if (!noNeedLogin && !user.name) {
    //   fetchCurrent().then(u => {
    //     if (!u) {
    //       router.push('/user/login');
    //     }
    //   });
    // }
  }, [noNeedLogin, user]);

  // 不需要登录的页面，单独布局
  if (noNeedLogin) {
    return children;
  }

  // 加载当前用户期间，loading
  // if (isEmpty(user) || userLoading) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: 120 }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  // 渲染标准布局
  return (
    <>
        <Layout
          style={{
            backgroundColor: '#efefef',
            minHeight: '100vh'
          }}
        >
          <Header user={user} location={location}/>
          <Content style={{margin:'0 15px'}}>{children}</Content>
        </Layout>
      {/* <Header user={user} /> */}
      {/* <div className={styles.content}>{children}</div> */}
    </>
  );
};

export default connect(
  ({ user, loading }: any) => ({
    user: user.user,
    userLoading: loading.effects['user/current'],
  }),
  dispatch => ({
    fetchCurrent: () => dispatch({ type: 'user/current' }),
  }),
)(BasicLayout);
