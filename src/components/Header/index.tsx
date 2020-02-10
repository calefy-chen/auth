import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default function Header(user: any) {
  const userInfo = user.user
  return (
    <div className={styles.header}>
      <span></span>
      <span>
        <Icon type="github" style={{fontSize: 18, marginRight: 4}} />
        <span className={styles.name}>{userInfo.name}</span>
      </span>
    </div>
  )
}
