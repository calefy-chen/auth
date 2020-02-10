import React from 'react';
import { Breadcrumb, Card, Icon } from 'antd';
import styles from './index.css';

export default function() {
  return (
    <div>
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
