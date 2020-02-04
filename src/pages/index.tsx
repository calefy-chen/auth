import React, { useEffect } from 'react';
import Link from 'umi/link'
import { Breadcrumb, Card, Icon } from 'antd';
import styles from './index.css';

export default function() {
  return (
    <div>
      <p>
        <Link to="/projects">项目列表</Link>
      </p>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="动态">
        <Card.Grid className={styles.card}>
          <Icon type="cluster" /> 中央监控
        </Card.Grid>
      </Card>
    </div>
  );
}
