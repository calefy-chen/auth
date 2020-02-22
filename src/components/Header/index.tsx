import React , { useState, useEffect, useCallback }from 'react';
import Link from 'umi/link';
import { Icon, Dropdown, Menu } from 'antd';
import Cookies from 'js-cookie'
import styles from './index.less';
import router from 'umi/router';

export default function Header(user: any) {
  const userInfo = user.user;
  const loginOut = useCallback((key = null) => {
      if(key === '1'){
        Cookies.remove('auth.token');
        router.push('/user/login')
      }
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <span className={styles.home} style={{ float: 'left' }}>
          <Icon type="home" style={{ fontSize: 16, marginRight: 4 }} />
          <Link to="/">首页</Link>
        </span>
        <span style={{ float: 'right' }}>
          <Dropdown
            overlay={
              <Menu onClick={({key}) => loginOut(key)}>
                <Menu.Item key="1">
                  <a>退出登录</a>
                </Menu.Item>
              </Menu>
            }
          >
            <a className={styles.name}>
              {userInfo.name} <Icon type="down" />
            </a>
          </Dropdown>
        </span>
      </div>
    </div>
  );
}
