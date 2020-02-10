/*
 * @Author: 林骏宏
 * @Date: 2020-01-21 15:09:46
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-08 16:23:02
 * @Description: file content
 */
import React, { Component } from 'react';
import { Timeline } from 'antd';
import { timeString } from '@/utils/utils';
import styles from './logs.less';

const interData = [
  { title: '前端', creatTime: 1578638706000, time: '15秒', params: '测试', url: '192.168.1.1' },
  { title: 'Nginx', creatTime: 1578638706000, time: '15秒', params: '测试', url: '192.168.1.1' },
  { title: '微服务', creatTime: 1578638706000, time: '15秒', params: '测试', url: '192.168.1.1' },
];

class Logs extends Component {
  getData(item) {
    const data = [
      { label: '响应', value: item.time },
      { label: '参数', value: item.params },
      { label: 'URl', value: item.url },
    ];
    return data;
  }

  render() {
    return <div className={styles.logBox}>{this.renderTimeline(interData)}</div>;
  }

  renderTimeline(list) {
    return (
      <Timeline>
        {list.map((item, index) => {
          const color = 'green';
          return (
            <Timeline.Item key={index} color={color} className={styles.recordItem}>
              <div className={styles.recordWrap}>
                <div className={styles.recordTitle}>
                  <div className={styles.recordTitleTime}>
                    <p>{timeString(item.creatTime, 'YYYY-MM-DD')}</p>
                    <p>{timeString(item.creatTime, 'HH:mm')}</p>
                  </div>
                  <div className={styles.recordTitleText}>{item.title}</div>
                </div>

                {this.renderDetail(item)}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  }

  // 日志详情信息
  renderDetail(item) {
    // 获取展示数据
    let data = [];
    data = this.getData({ ...item });
    return (
      <div>
        {data.map((items, index) => (
          <div key={index}>
            <span className={styles.label}>{items.label}：</span>
            {items.value}
          </div>
        ))}
      </div>
    );
  }
}
export default Logs;
