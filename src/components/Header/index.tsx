import React, { useCallback } from 'react';
import { Icon } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';

interface HeaderProps {
  user: any;
  logout(): Promise<any>;
}

const Header = ({
  user,
  logout
}: HeaderProps) => {

  const onLogout = useCallback(() => {
    logout();
    setTimeout(() => {
      router.push('/user/login');
    }, 0);
  }, [])

  return (
    <div className={styles.header}>
      <span></span>
      <span>
        <Icon type="github" style={{fontSize: 20, marginRight: 4}} />
        <span className={styles.name}>{user.name}</span>
        <span className={styles.out} onClick={onLogout}>退出</span>
      </span>
    </div>
  )
};

export default connect(
  null,
  dispatch => ({
    logout: () => dispatch({ type: 'user/logout' }),
  }),
)(Header);
