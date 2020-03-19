import React, { useEffect } from 'react';
import router from 'umi/router';
import { Breadcrumb, Card, Icon } from 'antd';
import styles from './index.css';

export default function() {
  useEffect(() => {
    router.replace('/letter')
  },[])

  return (
    <div>
    </div>
  );
}
