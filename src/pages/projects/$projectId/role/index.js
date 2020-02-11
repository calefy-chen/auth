/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:34:45
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-11 10:09:49
 * @Description: file content
 */
import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import { connect } from 'dva';
import DragTree from '@/components/DragTree/dragTree';
import RoleForm from './roleForm';
import './index.css';
const { confirm } = Modal;
@connect(
  ({ auth, project }) => ({
    projectId: project.projectDetail.id,
    authList: auth.authList,
  }),
  dispatch => ({
    dragItem: payload => dispatch({ type: 'auth/dragItem', payload }),
    deleteAuth: payload => dispatch({ type: 'auth/deleteAuth', payload }),
    fetchAuthList: payload => dispatch({ type: 'auth/getAuthList', payload }),
  }),
)
class index extends Component {
  state = { visible: false, roleDetail: {}, parentId: '',afterClose:false };
  onDrop = info => {
    const { dragItem } = this.props;
    const id = info.dragNode.props.dataRef.id;
    let parentId;
    if (!info.dropToGap) {
      parentId = info.node.props.dataRef.id;
    } else {
      parentId = info.node.props.dataRef.parentId;
    }
    const level = info.node.props.pos.split('-').pop() - 0 + 1;
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
        this.lookPer(parentId);
        break;
      default:
        break;
    }
  };
  editPer(item, parentId) {
    this.setState({
      visible: true,
      roleDetail: item,
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
  lookPer(parentId) {
    console.log(parentId, '4');
  }
  hideModal = () => {
    this.setState({
      visible: false,
      roleDetail: {},
    });
  };
  onEditEnd = () => {
    const { fetchAuthList, projectId } = this.props;
    this.setState({
      visible: false,
      roleDetail: {},
    });
    fetchAuthList(projectId);
  };
  render() {
    const { visible, roleDetail, parentId } = this.state;
    const { authList } = this.props;
    const iconData = ['edit', 'delete', 'plus-square'];
    return (
      <>
        <Button type="primary" onClick={() => this.addPer('')}>
          新增权限
        </Button>
        <DragTree
          treeData={authList['role']}
          iconData={iconData}
          onOption={this.onOption}
          onDrop={this.onDrop}
        />
        <Modal
          title="创建/编辑角色"
          width={720}
          visible={visible}
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}
          afterClose={this.afterClose}
        >
          {visible? <RoleForm
            roleDetail={roleDetail}
            cancel={this.hideModal}
            parentId={parentId}
            onEditEnd={this.onEditEnd}
          />:null}

        </Modal>
      </>
    );
  }
}
export default index;
