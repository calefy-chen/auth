/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:34:45
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-21 14:53:19
 * @Description: file content
 */
import React, { Component } from 'react';
import { Modal, Button, message, Descriptions, Spin, Tag } from 'antd';
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
    authData: auth.authData,
  }),
  dispatch => ({
    deleteAuth: payload => dispatch({ type: 'auth/deleteAuth', payload }),
    fetchAuthList: payload => dispatch({ type: 'auth/getAuthList', payload }),
    getAssignedToWho: payload => dispatch({ type: 'authAssign/getAssignedToWho', payload }),
  }),
)
class index extends Component {
  state = { visible: false, perDetail: {}, parentId: '', eyeVisible: false };
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
  }
  deletePer(item, parentId) {
    const { fetchAuthList, deleteAuth, projectId } = this.props;
    confirm({
      title: `您确认要删除"${item.name}"吗？`,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        deleteAuth({ id: item.id }).then(res => {
          if (res.code === 200) {
            message.success('删除成功');
            fetchAuthList(projectId);
          } else {
            message.error(res.message);
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
    });
    setTimeout(() => {
      this.setState({
        perDetail: {},
      });
    }, 300);
  };
  hideEyeModal = () => {
    this.setState({
      eyeVisible: false,
    });
  };
  onEditEnd = () => {
    const { fetchAuthList, projectId } = this.props;
    this.hideModal();
    fetchAuthList(projectId);
  };
  render() {
    const { visible, perDetail, parentId, eyeVisible } = this.state;
    const { toWhoData, loading, authData } = this.props;
    const iconData = { 'plus-square': '添加', edit: '编辑', eye: '查看权限分配', delete: '删除' };
    let rolesArr = [];
    if (toWhoData['roles']) {
      toWhoData['roles'].forEach(item => {
        for (const key in authData) {
          if (item === key) {
            rolesArr.push(authData[key]['name']);
          }
        }
      });
    }
    let userArr = [];
    if (toWhoData['users']) {
      userArr = toWhoData['users'].map(item => item.userName);
    }
    return (
      <>
        <Button type="primary" onClick={() => this.addPer('')}>
          新增权限
        </Button>
        <DragTree
          authKey="permission"
          iconData={iconData}
          onOption={this.onOption}
          onDrop={this.onDrop}
        />
        <Modal
          title={perDetail.id ? '编辑权限' : '新增权限'}
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
          ) : (
            <Descriptions bordered size="small">
              {
                <Descriptions.Item label="角色" span={3}>
                  {rolesArr.length
                    ? rolesArr.map(item => (
                        <Tag color="geekblue" style={{ marginBottom: '5px' }}>
                          {item}
                        </Tag>
                      ))
                    : '暂无角色分配'}
                </Descriptions.Item>
              }
              {
                <Descriptions.Item label="人员" span={3}>
                  {userArr.length
                    ? userArr.map(item => (
                        <Tag color="geekblue" style={{ marginBottom: '5px' }}>
                          {item}
                        </Tag>
                      ))
                    : '暂无人员分配'}
                </Descriptions.Item>
              }
            </Descriptions>
          )}
        </Modal>
      </>
    );
  }
}
export default index;
