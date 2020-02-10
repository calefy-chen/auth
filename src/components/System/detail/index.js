/*
 * @Author: 林骏宏
 * @Date: 2020-01-15 17:24:50
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-02-10 15:49:19
 * @Description: file content
 */
/**
 * 详情
 */
import React, { Component } from 'react';
import { Descriptions, Collapse, Tabs } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import PageLoading from '@/components/PageLoading';
import FlowLogs from '../logs';
import SubmitForm from '../form';
import styles from './index.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;

const formatFlag = {
  '0': '否',
  '1': '是',
};

@connect(
  ({ system }) => ({
    detail: system.systemDetail,
  }),
  dispatch => ({
    fetchDetail: alarmId => dispatch({ type: 'system/querySystemAlarmById', payload: { alarmId } }),
  }),
)
class FlowDetailIndex extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // id
    onEnd: PropTypes.func.isRequired, // 处理完成后回调
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      this.getDetail(id);
    }
  }

  // 获取详情
  getDetail(alarmId) {
    const { fetchDetail } = this.props;
    fetchDetail(alarmId);
  }

  render() {
    const { detail, onEnd, id } = this.props;
    if (isEmpty(detail)) {
      return <PageLoading />;
    }
    return (
      <div className={styles.container}>
        <Tabs>
          <TabPane tab="详情" key="1">
            <div style={{ marginTop: 20 }}>
              <Descriptions title="" layout="vertical" column={4} bordered size="small">
                <Descriptions.Item label="预警id">{detail.alarmId}</Descriptions.Item>
                <Descriptions.Item label="预警IP">{detail.sourceIp}</Descriptions.Item>
                <Descriptions.Item label="预警时间">{detail.alarmTime}</Descriptions.Item>
                <Descriptions.Item label="来源系统">{detail.alarmSource}</Descriptions.Item>
                <Descriptions.Item label="预警大类">{detail.alarmType}</Descriptions.Item>
                <Descriptions.Item label="预警细类">{detail.subType}</Descriptions.Item>
                <Descriptions.Item label="预警摘要">{detail.alarmTitle}</Descriptions.Item>
                <Descriptions.Item label="预警内容">{detail.alarmDesc}</Descriptions.Item>
                <Descriptions.Item label="是否已推送预警">
                  {formatFlag[detail.msgFlag]}
                </Descriptions.Item>
                <Descriptions.Item label="是否被投诉">
                  {formatFlag[detail.cmpFlag]}
                </Descriptions.Item>
                <Descriptions.Item label="是否误报">
                  {formatFlag[detail.mireport]}
                </Descriptions.Item>
                <Descriptions.Item label="处理人">{detail.disUsr}</Descriptions.Item>
                <Descriptions.Item label="是否已处理">
                  {formatFlag[detail.disFlag]}
                </Descriptions.Item>
                <Descriptions.Item label="处理详情">{detail.disDetail}</Descriptions.Item>
                <Descriptions.Item label="处理时间">{detail.disTime}</Descriptions.Item>
              </Descriptions>
            </div>
          </TabPane>
          <TabPane tab="链路日志" key="2">
            <div style={{ marginTop: 20 }}>
              <FlowLogs />
            </div>
          </TabPane>
        </Tabs>
        <Collapse defaultActiveKey={['1']} style={{ marginTop: 20 }}>
          <Panel header="处置表单" key="1">
            <SubmitForm onEnd={onEnd} alarmId={id} noModal />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default FlowDetailIndex;
