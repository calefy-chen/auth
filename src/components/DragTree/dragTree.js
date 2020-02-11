/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:41:49
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-11 10:13:49
 * @Description: file content
 */
import React, { Component } from 'react';
import {connect} from 'dva'
import { Tree, Icon,Empty } from 'antd';
import PropTypes from 'prop-types';
import './index.css'

const { TreeNode } = Tree;

@connect(
  ({ loading }) => ({
    loading: loading.effects['auth/getAuthList']
  }),
  dispatch => ({

  }),
)
 class dragTree extends Component {
  static propTypes={
    treeData:PropTypes.object.isRequired,
    onOption:PropTypes.func,
    iconData:PropTypes.array,
    onDrop:PropTypes.func
  }
  componentDidMount() {
    const { treeData } = this.props;
    this.setState({
      gData: [].concat(treeData)
    });
  }

  state = {
    gData: [],
  };

  onDrop = info => {
    const {onDrop} = this.props
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
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
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
    this.setState({
      gData: data,
    });
    onDrop(info)
  };
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
  iconButton(msg) {
    const { iconData } = this.props;
    return (
      <div className="dragItem clearfix">
        <p style={{ float: 'left' }}>
          <span>{msg.name}</span>&nbsp;&nbsp;
          <span style={{color:'#999'}}>{msg.code}</span>
        </p>
        <div style={{ float: 'right' }} className="iconGroup">
          {
          iconData.map((item,index)=> {
            return (
              <span
                style={{display:'inline-block',marginRight:'5px'}}
                onClick={() => {
                  this.onOption(msg,msg.parentId,item);
                }}
                key={index}
              >
                <Icon type={item} style={{fontSize:'14px'}}/>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
  onOption(item,parentId,type) {
    const {onOption} = this.props
    if(!parentId){
      parentId = item.id
    }
    onOption(item,parentId,type)
  }
  render() {
    const { gData } = this.state;
    return (
      gData.length?
      (<Tree
        className="draggable-tree"
        draggable
        blockNode
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
      >
        {this.renderTreeNodes(gData)}
      </Tree>):
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    );
  }
}
export default dragTree
