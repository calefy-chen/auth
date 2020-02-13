/*
 * @Author: 林骏宏
 * @Date: 2020-01-21 15:09:46
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-08 16:23:02
 * @Description: file content
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Timeline } from 'antd';
import PageLoading from '@/components/PageLoading';
import { timeString } from '@/utils/utils';
import styles from './logs.less';

@connect(
  ({ system, loading }) => ({
    logs: system.logs,
    logLoading: loading.effects['system/getLinkLogList']
  }),
  dispatch => ({
    fetchLog: alarmId => dispatch({ type: 'system/getLinkLogList', payload: { alarmId } }),
  }),
)
class Logs extends Component {
  getData(item) {
    const data = [
      { label: '响应', value: item.requestTime !== '-' ? `${item.requestTime}毫秒` : item.requestTime },
      { label: '参数', value: item.request },
      { label: 'URl', value: item.remoteAddr },
    ];
    return data;
  }

  componentDidMount() {
    const { alarmId, fetchLog } = this.props;
    if (alarmId) {
      fetchLog(alarmId);
    }
  }

  render() {
    const { logs, logLoading } = this.props
    if (logLoading) {
      return <PageLoading />;
    }
    return <div className={styles.logBox}>{this.renderTimeline(logs)}</div>;
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
                    <p>{timeString(item.createTime, 'YYYY-MM-DD')}</p>
                    <p>{timeString(item.createTime, 'HH:mm')}</p>
                  </div>
                  <div className={styles.recordTitleText}>{item.logType}</div>
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
