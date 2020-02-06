import React from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import styles from './index.less';

export default function Header(user: any) {
  const userInfo = user.user
  return (
    <div className={styles.header}>
      <span className={styles.home}>
        <Icon type="home" style={{fontSize: 16, marginRight: 4}}/>
        <Link to="/">首页</Link>
      </span>
      <span>
        <Icon type="github" style={{fontSize: 18, marginRight: 4}} />
        <span className={styles.name}>{userInfo.name}</span>
      </span>
    </div>
  )
}
