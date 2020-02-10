/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * 系统故障预警
 */
import React, { Component } from 'react';
import { Divider, Modal, message, Button } from 'antd';
import { connect } from 'dva';
import find from 'lodash/find';
import SearchListWithForm from '@/components/List/SearchListWithForm';
import SearchForm from '@/components/List/SearchForm';
import SubmitForm from '@/components/System/form';
import Drawer from '@/components/System/detail/DetailWithDrawer';
import { SYSTEM_WARN } from '@/const/base';
import styles from './index.less';
import { timeString } from '@/utils/utils';

const { confirm } = Modal;

// 格式转换
function FormatVal(value) {
  if (value) {
    const obj = find(SYSTEM_WARN.FLAG, { value });
    return obj && obj.name ? obj.name : null;
  }
  return null;
}

@connect(
  ({ system, loading }) => ({
    list: system.systemData.list,
    total: system.systemData.total,
    systemType: system.systemType,
    alarmBigList: system.alarmBigList,
    alarmMinList: system.alarmMinList,
    listLoading: loading.effects['system/getSystemList'],
  }),
  dispatch => ({
    loadData: params => dispatch({ type: 'system/getSystemList', payload: params }),
    updataStatus: params => dispatch({ type: 'system/updateSystemAlarmStatus', payload: params }), // 确认误报
    deleteAlarm: params => dispatch({ type: 'system/deleteSystemAlarmById', payload: params }), // 删除
    cleanDetail: () => dispatch({ type: 'system/cleanDetail' }),
  })
)
class SystemWarning extends Component {
  listRef = React.createRef();

  // 列
  columns = [
    {
      title: '来源系统',
      width: 120,
      dataIndex: 'alarmSourceName',
    },
    {
      title: '分类',
      width: 120,
      dataIndex: 'subTypeName',
    },
    {
      title: '预警时间',
      dataIndex: 'alarmTime',
      width: 120,
      render: date => timeString(date, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '预警摘要',
      width: 120,
      dataIndex: 'alarmTitle',
    },
    {
      title: '处理人',
      width: 120,
      dataIndex: 'disUsr',
    },
    {
      title: '是否处理',
      dataIndex: 'disFlag',
      width: 100,
      render: value => FormatVal(value),
    },
    {
      title: '是否被起诉',
      dataIndex: 'cmpFlag',
      width: 110,
      render: value => FormatVal(value),
    },
    {
      title: '是否误报',
      dataIndex: 'mireport',
      width: 100,
      render: value => FormatVal(value),
    },
    {
      title: '操作',
      width: 200,
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleDetail(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleResemblance(record)}>相似</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleConfirm(record)}>误报</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDel(record)}>删除</a>
        </span>
      ),
    },
  ];

  state = {
    list: [],
    total: 0,
    alarmType: '', // 预警大类
    showDetailId: null, // 要显示的详情id
    formModal: null, // 显示添加弹窗
    test: null,
  };

  constructor(props) {
    super(props);

    this.handleDetail = this.handleDetail.bind(this);
    this.handleHideDetail = this.handleHideDetail.bind(this);
    this.handleFlowEnd = this.handleFlowEnd.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleResemblance = this.handleResemblance.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.searchItems = this.searchItems.bind(this);
    this.getListData = this.getListData.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname } } = this.props
    if (prevProps.location.pathname !== pathname) {
      // this.getListData()
      this.listRef.current.resetForm();
    }
  }

  // 显示详情
  handleDetail(record) {
    this.setState({ showDetailId: record.alarmId });
  }

  // 隐藏详情
  handleHideDetail() {
    const { cleanDetail } = this.props
    cleanDetail()
    this.setState({ showDetailId: null });
  }

  // 一个流程处理完成
  handleFlowEnd() {
    this.handleHideDetail();
    this.listRef.current.gotoPage(1);
  }

  // 误报二次确认
  handleConfirm(record) {
    const { updataStatus } = this.props;
    const that = this;
    confirm({
      title: '是否修改为误报？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        updataStatus({
          alarmId: record.alarmId,
        }).then(res => {
          if (res.code) {
            message.success('修改成功');
            that.listRef.current.gotoPage(1);
          }
        });
      },
    });
  }

  // 删除
  handleDel(record) {
    const { deleteAlarm } = this.props;
    const that = this;
    confirm({
      title: '是否删除该预警？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteAlarm({
          alarmId: record.alarmId,
        }).then(res => {
          if (res.code) {
            message.success('删除成功');
            that.listRef.current.gotoPage(1);
          }
        });
      },
    });
  }

  // 相似
  handleResemblance(record) {
    this.listRef.current.handleSearchChange({
      alarmType: record.alarmType,
      subType: record.subType,
      alarmSource: record.alarmSource,
    });
  }

  // 点击下发任务按钮
  handleAdd() {
    this.setState({ formModal: 'add' });
  }

  // 隐藏弹框
  handleHideModal() {
    this.setState({ formModal: null });
  }

  // 搜索项
  searchItems() {
    const { systemType, alarmMinList } = this.props;
    return [
      { name: 'alarmSource', label: '来源系统', type: SearchForm.SELECT, data: systemType },
      { name: 'subType', label: '分类', type: SearchForm.SELECT, data: alarmMinList },
      { name: 'time', label: '预警时间', type: SearchForm.DATE_RANGE },
      { name: 'alarmTitle', label: '预警摘要' },
      { name: 'disUsr', label: '处理人' },
      { name: 'disFlag', label: '是否处理', type: SearchForm.SELECT_FLAG },
      { name: 'cmpFlag', label: '是否被投诉', type: SearchForm.SELECT_FLAG },
      { name: 'mireport', label: '是否误报', type: SearchForm.SELECT_FLAG },
    ];
  }


  // 列表数据
  getListData(params) {
    const { loadData, match } = this.props;
    const alarmType = match.params.typeId
    loadData({
      alarmType,
      ...params,
    })
  }

  render() {
    const { list, total, listLoading } = this.props;
    const { showDetailId, formModal } = this.state;

    const addButton = (
      <div style={{ marginBottom: 14 }}>
        <Button type="primary" onClick={this.handleAdd}>
          添加
        </Button>
        <SubmitForm
          type={formModal || ''}
          onClose={this.handleHideModal}
          onEnd={this.handleFlowEnd}
        />
      </div>
    );

    return (
      <div className="pageBox">
        <div className={styles.containtBox}>
          <SearchListWithForm
            ref={this.listRef}
            searchItems={this.searchItems()}
            toolbarNode={addButton}
            columns={this.columns}
            dataSource={list}
            total={total}
            loading={listLoading}
            loadData={this.getListData}
            scrollWidth={1100}
          />

          <Drawer id={showDetailId} hideModal={this.handleHideDetail} onEnd={this.handleFlowEnd} />
        </div>
      </div>
    );
  }
}

export default SystemWarning;
