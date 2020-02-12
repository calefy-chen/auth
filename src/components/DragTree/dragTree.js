/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:41:49
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-12 19:53:42
 * @Description: file content
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree, Icon, Empty, Card, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import './index.css';

const { TreeNode } = Tree;

@connect(
  ({ loading, auth }) => ({
    loading: loading.effects['auth/getAuthList'],
    authList: auth.authList,
  }),
  dispatch => ({
    // setAuthList:
    setAuthList: payload => dispatch({ type: 'auth/setAuthList', payload }),
  }),
)
class dragTree extends Component {
  static propTypes = {
    key: PropTypes.string,
    onOption: PropTypes.func,
    iconData: PropTypes.object,
    onDrop: PropTypes.func,
  };

  onDrop = info => {
    const { onDrop, authKey, authList, setAuthList } = this.props;
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (parseInt(item.id) === parseInt(key)) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    // 深度copy authList
    const allData = Object.assign({}, authList);
    // 获取当前data
    const data = allData[authKey];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    //修改目标的parentId
    dragObj.parentId = info.node.props.dataRef.parentId

    if (!info.dropToGap) {
      // Drop on the content
      //如果拖拽的数据没chilren折拖拽数据parentId为上级id
      dragObj.parentId = info.node.props.dataRef.id
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    allData[authKey] = data;
    // 修改redux中authList
    setAuthList(allData);
    onDrop(info);
  };
  //递归渲染treeNode
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={this.iconButton(item)} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={this.iconButton(item)} dataRef={item} />;
    });
  // 操作按钮
  iconButton(msg) {
    const { iconData } = this.props;
    return (
      <div className="dragItem clearfix">
        <p style={{ float: 'left' }}>
          <span>{msg.name}</span>&nbsp;&nbsp;
          <span style={{ color: '#999' }}>{msg.code}</span>
        </p>
        <div style={{ float: 'right' }} className="iconGroup">
          {Object.keys(iconData).map((item, index) => {
            return (
              <Tooltip key={index} placement="topLeft" title={iconData[item]}>
                <span
                  style={{ display: 'inline-block', paddingLeft: '10px' }}
                  onClick={() => {
                    this.onOption(msg, msg.parentId, item);
                  }}
                >
                  <Icon type={item} style={{ fontSize: '14px' }} />
                </span>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }
  // 点击操作按钮，回调事件
  onOption(item, parentId, type) {
    const { onOption } = this.props;
    if (!parentId) {
      parentId = item.id;
    }
    onOption(item, parentId, type);
  }
  render() {
    const { authList, authKey } = this.props;
    return authList[authKey].length ? (
      <Card style={{ width: '60%', margin: '15px auto 0 auto' }}>
        <Tree className="draggable-tree" draggable blockNode defaultExpandAll onDrop={this.onDrop}>
          {this.renderTreeNodes(authList[authKey])}
        </Tree>
      </Card>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }
}
export default dragTree;
