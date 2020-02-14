/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:34:45
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-14 18:07:43
 * @Description: file content
 */
import React, { Component } from 'react';
import get from 'lodash/get';
import { Modal, Button, message, Descriptions, Empty, Spin } from 'antd';
import { connect } from 'dva';
import DragTree from '@/components/DragTree/dragTree';
import PerForm from './perForm';
import './index.css';
const { confirm } = Modal;
@connect(
  ({ auth, project, loading, authAssign }) => ({
    loading: loading.effects['authAssign/getAssignedToWho'],
    toWhoData: authAssign.toWhoData,
    projectId: project.projectDetail.id,
    authList: auth.authList,
  }),
  dispatch => ({
    dragItem: payload => dispatch({ type: 'auth/dragItem', payload }),
    deleteAuth: payload => dispatch({ type: 'auth/deleteAuth', payload }),
    fetchAuthList: payload => dispatch({ type: 'auth/getAuthList', payload }),
    getAssignedToWho: payload => dispatch({ type: 'authAssign/getAssignedToWho', payload }),
  }),
)
class index extends Component {
  state = { visible: false, perDetail: {}, parentId: '', eyeVisible: false };
  onDrop = info => {
    const { dragItem } = this.props;
    const id = info.dragNode.props.dataRef.id;
    let parentId;
    let level = info.node.props.pos.split('-').pop() - 0 + 1;
    if (!info.dropToGap) {
      parentId = info.node.props.dataRef.id;
      level = info.node.props.dataRef.children.length
    } else {
      parentId = info.node.props.dataRef.parentId;
    }
    console.log(info,'level')
    dragItem({ id, parentId, level });
  };
  onOption = (item, parentId, type) => {
    switch (type) {
      case 'edit':
        this.editPer(item, parentId);
        break;
      case 'delete':
        this.deletePer(item, parentId);
        break;
      case 'plus-square':
        this.addPer(parentId);
        break;
      case 'eye':
        this.lookPer(item);
        break;
      default:
        break;
    }
  };
  editPer(item, parentId) {
    this.setState({
      visible: true,
      perDetail: item,
      parentId: parentId,
    });
    console.log(item, parentId, '1');
  }
  deletePer(item, parentId) {
    const { fetchAuthList, deleteAuth, projectId } = this.props;
    console.log(item, 'xxx');
    confirm({
      title: `您确认要删除"${item.name}"吗？`,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        deleteAuth({ id: item.id }).then(res => {
          if (res.code === 200) {
            message.success('删除成功');
            fetchAuthList(projectId);
          }
        });
      },
    });
  }
  addPer(parentId) {
    this.setState({
      visible: true,
      parentId: parentId,
    });
  }
  lookPer(item) {
    const { getAssignedToWho } = this.props;
    this.setState({
      eyeVisible: true,
    });
    getAssignedToWho({ itemId: item.id });
  }
  hideModal = () => {
    this.setState({
      visible: false,
      perDetail: {},
    });
  };
  hideEyeModal = () => {
    this.setState({
      eyeVisible: false,
    });
  };
  onEditEnd = () => {
    const { fetchAuthList, projectId } = this.props;
    this.setState({
      visible: false,
      perDetail: {},
    });
    fetchAuthList(projectId);
  };
  render() {
    const { visible, perDetail, parentId, eyeVisible } = this.state;
    const { authList, toWhoData, loading } = this.props;
    const iconData = { edit: '编辑', delete: '删除', 'plus-square': '新增', eye: '查看权限分配' };
    return (
      <>
        <Button type="primary" onClick={() => this.addPer('')}>
          新增权限
        </Button>
        <DragTree
          authKey='permission'
          iconData={iconData}
          onOption={this.onOption}
          onDrop={this.onDrop}
        />
        <Modal
          title="创建/编辑权限"
          visible={visible}
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}
        >
          <PerForm
            perDetail={perDetail}
            cancel={this.hideModal}
            parentId={parentId}
            onEditEnd={this.onEditEnd}
          />
        </Modal>
        <Modal
          title="该权限分配给了？"
          visible={eyeVisible}
          onCancel={this.hideEyeModal}
          maskClosable={false}
          footer={null}
        >
          {loading ? (
            <Spin />
          ) : get(toWhoData, 'roles', []).length || get(toWhoData, 'users', []).length ? (
            <Descriptions  bordered size="small">
              {get(toWhoData, 'roles', []).length && toWhoData['roles'] ? (
                <Descriptions.Item label="角色" span={3}>{toWhoData['roles']}</Descriptions.Item>
              ) : null}
              {get(toWhoData, 'users', []).length ? (
                <Descriptions.Item label="人员" span={3}>{toWhoData['users'].map(item => item.userName).join(',')}</Descriptions.Item>
              ) : null}
            </Descriptions>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="该权限暂无分配" />
          )}
        </Modal>
      </>
    );
  }
}
export default index;
