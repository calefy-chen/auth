import React from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import styles from './index.less';

export default function Header(user: any) {
  const userInfo = user.user
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <span className={styles.home} style={{float:'left'}}>
        <Icon type="home" style={{fontSize: 16, marginRight: 4}}/>
        <Link to="/">首页</Link>
        </span>
        <span style={{float:'right'}}>
          <span className={styles.name}>{userInfo.name}</span>
        </span>
      </div>

    </div>
  )
}
