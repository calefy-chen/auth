/*
 * @Author: 王硕
 * @Date: 2020-02-14 18:12:18
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-17 15:54:03
 * @Description: file content
 */
import React, { Component } from 'react';
import { Drawer, Tree, Row, Card, Col, Spin, List, Empty } from 'antd';
import { connect } from 'dva';
import './index.css';
const { TreeNode } = Tree;

@connect(
  ({ authAssign, loading }) => ({
    addressList: authAssign.addressList,
    loading: loading.effects['authAssign/getAddressList'],
    OrgIdLoading: loading.effects['authAssign/getByOrgId'],
    userMsg: authAssign.addrUserInfo,
  }),
  dispatch => ({
    searchUser: payload => dispatch({ type: 'authAssign/searchUser', payload }),
    getAddressList: () => dispatch({ type: 'authAssign/getAddressList' }),
    getByOrgId: payload => dispatch({ type: 'authAssign/getByOrgId', payload }),
  }),
)
class addressBook extends Component {
  state = {
    isSelect: false,
  };
  componentDidMount() {
    const { getAddressList } = this.props;
    getAddressList();
  }

  onClose = () => {
    const { onDrawerClose } = this.props;
    this.setState({
      isSelect: false,
    });
    onDrawerClose();
  };
  handelClick = data => {
    const { onAddressChange } = this.props;
    onAddressChange(data);
    this.setState({
      isSelect: false,
    });
  };
  onTreeSelect = (key, e) => {
    const { getByOrgId } = this.props;
    getByOrgId({ orgId: key, isAddress: true });
    this.setState({
      isSelect: true,
    });
  };
  //递归渲染treeNode
  renderTreeNodes = data =>
    data.map(item => {
      if (item.subNode) {
        return (
          <TreeNode title={item.orgName} key={item.orgId} dataRef={item}>
            {this.renderTreeNodes(item.subNode)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgName} key={item.orgId} dataRef={item} />;
    });
  render() {
    const { addressList, loading, userMsg, OrgIdLoading, drawerVisible } = this.props;
    const { isSelect } = this.state;
    return (
      <Drawer
        title="人员选择"
        width="480"
        onClose={this.onClose}
        visible={drawerVisible}
        maskClosable={false}
      >
        <Row>
          <Col span={12} style={{ maxHeight: 'calc(100vh - 110px)', overflow: 'hidden' }}>
            <Card style={{ height: 'calc(100vh - 110px)', overflowY: 'auto' }}>
              {drawerVisible ? (
                <Spin spinning={loading}>
                  <Tree className="draggable-tree" showLine blockNode onSelect={this.onTreeSelect}>
                    {this.renderTreeNodes(addressList)}
                  </Tree>
                </Spin>
              ) : null}
            </Card>
          </Col>
          <Col span={12} style={{ height: 'calc(100vh - 110px)', overflowY: 'auto' }}>
            {isSelect ? (
              <Spin spinning={OrgIdLoading}>
                <List
                  bordered
                  dataSource={userMsg}
                  style={{ borderLeft: 0, height: 'calc(100vh - 110px)' }}
                  renderItem={item => (
                    <List.Item
                      className="listItem"
                      style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderBottom: '1px solid #dedede',
                      }}
                      onClick={() => this.handelClick({ userId: item.oaCode, userName: item.name })}
                    >
                      {item.name}
                    </List.Item>
                  )}
                />
              </Spin>
            ) : (
              <Empty description={false} />
            )}
          </Col>
        </Row>
      </Drawer>
    );
  }
}
export default addressBook;
