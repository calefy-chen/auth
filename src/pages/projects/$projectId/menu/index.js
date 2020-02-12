/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:34:45
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-12 19:19:16
 * @Description: file content
 */
import React, { Component } from 'react';
import { Modal ,Button,message} from 'antd';
import { connect } from 'dva';
import DragTree from '@/components/DragTree/dragTree';
import MenuForm from './menuForm';
import './index.css';
const { confirm } = Modal;
@connect(
  ({ auth,project }) => ({
    projectId: project.projectDetail.id,
    authList: auth.authList
  }),
  dispatch => ({
    dragItem: payload => dispatch({ type: 'auth/dragItem', payload }),
    deleteAuth:payload => dispatch({ type: 'auth/deleteAuth', payload }),
    fetchAuthList: payload => dispatch({ type: 'auth/getAuthList', payload }),
  }),
)
class index extends Component {
  state = { visible: false, menuDetail: {}, parentId: '' };
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
        this.editMenu(item, parentId);
        break;
      case 'delete':
        this.deleteMenu(item,parentId);
        break;
      case 'plus-square':
        this.addMenu(parentId);
        break;
      default:
        break;
    }
  };
  // 编辑菜单
  editMenu(item, parentId) {
    this.setState({
      visible: true,
      menuDetail: item,
      parentId: parentId,
    });
  }
  // 删除菜单
  deleteMenu(item,parentId) {
    const {fetchAuthList,deleteAuth,projectId} = this.props
    confirm({
      title: `您确认要删除"${item.name}"吗？`,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        deleteAuth({ id: item.id }).then((res) => {
          if (res.code === 200) {
            message.success('删除成功');
            fetchAuthList(projectId);
          }
        });
      },
    });
  }
  addMenu(parentId) {
    this.setState({
      visible: true,
      parentId: parentId,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
      menuDetail: '',
    });
  };
  onEditEnd = () => {
    const { fetchAuthList, projectId } = this.props;
    this.setState({
      visible: false,
      menuDetail: '',
    });
    fetchAuthList(projectId);
  };
  render() {
    const { visible, menuDetail, parentId } = this.state;
    const iconData = { edit: '编辑', delete: '删除', 'plus-square': '新增' };
    return (
      <>
      <Button type="primary" onClick={()=>this.addMenu('')}>
          新增菜单
        </Button>
        <DragTree
          authKey='route'
          iconData={iconData}
          onOption={this.onOption}
          onDrop={this.onDrop}
        />
        <Modal
          title="创建/编辑菜单"
          visible={visible}
          onCancel={this.hideModal}
          maskClosable={false}
          footer={null}
        >
          <MenuForm
              menuDetail={menuDetail}
              cancel={this.hideModal}
              parentId={parentId}
              onEditEnd={this.onEditEnd}
            />
        </Modal>
      </>
    );
  }
}
export default index;
