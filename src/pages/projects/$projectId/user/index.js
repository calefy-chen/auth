/*
 * @Author: 王硕
 * @Date: 2020-02-13 10:02:58
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-17 17:07:49
 * @Description: file content
 */
import React, { Component } from 'react';
import {
  Tree,
  Spin,
  Card,
  Row,
  Col,
  Icon,
  Tooltip,
  Table,
  Empty,
  Modal,
  Form,
  Button,
  message,
  AutoComplete,
  Descriptions,
} from 'antd';
import { connect } from 'dva';
import RoleTransfer from '@/components/RoleTransfer';
import AddressBook from './addressBook';
const { Option } = AutoComplete;

const { TreeNode } = Tree;

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function() {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

@connect(
  ({ auth, project, authAssign, loading }) => ({
    authData: auth.authData,
    projectId: project.projectDetail.id,
    branchVo: authAssign.branchVo,
    BranchLoading: loading.effects['authAssign/queryBranchVo'],
    OrgIdLoading: loading.effects['authAssign/getByOrgId'],
    submitLoading: loading.effects['authAssign/authAssignToUser'],
    forUseLoading: loading.effects['authAssign/getAuthAssignForUser'],
    userInfo: authAssign.userInfo,
    authList: auth.authList,
  }),
  dispatch => ({
    searchUser: payload => dispatch({ type: 'authAssign/searchUser', payload }),
    queryBranchVo: () => dispatch({ type: 'authAssign/queryBranchVo' }),
    getByOrgId: payload => dispatch({ type: 'authAssign/getByOrgId', payload }),
    authAssignToUser: payload => dispatch({ type: 'authAssign/authAssignToUser', payload }),
    getAuthAssignForUser: payload => dispatch({ type: 'authAssign/getAuthAssignForUser', payload }),
    setAuthAssignForUser: payload => dispatch({ type: 'authAssign/setAuthAssignForUser', payload }),
    setAddByOrgId: payload => dispatch({ type: 'authAssign/setAddByOrgId', payload }),
  }),
)
class index extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '人员姓名',
        dataIndex: 'name',
      },
      {
        title: '角色',
        dataIndex: 'orgName',
      },
      {
        title: '操作',
        dataIndex: 'oaCode',
        render: (text, recard) => {
          return (
            <>
              <a onClick={() => this.editRole(recard)}>编辑权限</a>
              <a onClick={() => this.lookRole(recard)}>查看权限</a>
            </>
          );
        },
      },
    ];
  }
  state = {
    title: '未选择部门',
    roleVisible: false,
    bmId: '',
    userId: '',
    searchData: [],
    userRoleData: [],
    sendUserId: '',
    sendUserName: '',
    drawerVisible: false,
    roleList: [],
  };
  componentDidMount() {
    const { queryBranchVo, branchVo } = this.props;
    if (!branchVo.length) {
      queryBranchVo();
    }
  }
  onSearch = searchText => {
    const { searchUser } = this.props;
    searchUser({ keyword: searchText }).then(res => {
      this.setState({
        searchData: res.data.map(item => (
          <Option key={item.oaCode + '-' + item.name}>{item.name}</Option>
        )),
      });
    });
  };
  onSelect = value => {
    this.setState({
      sendUserId: value.split('-')[0],
      sendUserName: value.split('-')[1],
    });
  };
  onTransfer = roleData => {
    this.setState({
      userRoleData: roleData,
    });
  };
  //递归渲染treeNode
  renderTreeNodes = data =>
    data.map(item => {
      if (item.childBranch) {
        return (
          <TreeNode title={item.branchName} key={item.branchNo} dataRef={item}>
            {this.renderTreeNodes(item.childBranch)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.branchNo} title={item.branchName} dataRef={item} />;
    });
  onTreeSelect = (key, e) => {
    const { getByOrgId } = this.props;
    getByOrgId({ orgId: key });
    this.setState({
      title: e.node.props.title,
      bmId: e.node.props.dataRef.branchNo,
    });
  };
  addRole = () => {
    const { setAuthAssignForUser } = this.props;
    // 清空redux中userRole值
    setAuthAssignForUser([]);
    this.setState({
      roleVisible: true,
    });
  };
  lookRole = item => {
    const { projectId, getAuthAssignForUser, authData } = this.props;
    this.setState({
      eyeVisible: true,
    });
    getAuthAssignForUser({
      userId: item.oaCode,
      projectId: projectId,
    }).then(res => {
      if (res.code === 200) {
        const arr = [];
        res.data.map(item => {
          for (const key in authData) {
            if (item.toString() === key) {
              arr.push(authData[key]['name']);
            }
          }
        });
        this.setState({
          roleList: arr,
        });
      }
    });
  };
  hideEyeModal = () => {
    this.setState({
      eyeVisible: false,
    });
  };
  editRole = item => {
    const { projectId, getAuthAssignForUser } = this.props;
    this.setState({
      roleVisible: true,
      userId: item.oaCode,
      sendUserName: item.name,
      sendUserId: item.oaCode,
    });
    getAuthAssignForUser({
      userId: item.oaCode,
      projectId: projectId,
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          userRoleData: res.data.map(item => item.toString()),
        });
      }
    });
  };
  roleHideModal = () => {
    this.setState({
      sendUserId: '',
      sendUserName: '',
      userId: '',
      userRoleData: [],
      roleVisible: false,
    });
  };
  onEditEnd = () => {
    const { bmId } = this.state;
    const { getByOrgId } = this.props;
    this.setState({
      sendUserId: '',
      sendUserName: '',
      userId: '',
      userRoleData: [],
      roleVisible: false,
      eyeVisible: false,
    });
    getByOrgId({ orgId: bmId });
  };
  handleSubmit = () => {
    const { authAssignToUser, projectId } = this.props;
    const { sendUserId, sendUserName, userRoleData, bmId } = this.state;
    if (!sendUserId) {
      message.error('请选择人员');
    } else {
      authAssignToUser({
        projectId,
        items: userRoleData.join(','),
        userId: sendUserId,
        userName: sendUserName,
        orgId: bmId,
      }).then(res => {
        if (res.code === 200) {
          message.success('操作成功');
          this.onEditEnd();
        } else {
          message.error(res.message);
        }
      });
    }
  };
  autoChange = value => {
    this.setState({
      sendUserName: value,
    });
  };
  showDrawee = () => {
    const { setAddByOrgId } = this.props;
    this.setState({
      drawerVisible: true,
    });
    setAddByOrgId([]);
  };
  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  onAddressChange = data => {
    this.setState({
      sendUserName: data.userName,
      sendUserId: data.userId,
      drawerVisible: false,
    });
  };
  render() {
    const {
      branchVo,
      BranchLoading,
      forUseLoading,
      OrgIdLoading,
      userInfo,
      submitLoading,
      authList,
    } = this.props;
    const {
      title,
      roleVisible,
      searchData,
      userId,
      sendUserName,
      drawerVisible,
      eyeVisible,
      roleList,
    } = this.state;
    return (
      <>
        <Row>
          <Card>
            <Col span={6} style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              <Spin spinning={BranchLoading}>
                <Tree
                  className="draggable-tree"
                  showLine
                  blockNode
                  defaultExpandAll
                  onSelect={this.onTreeSelect}
                >
                  {this.renderTreeNodes(branchVo)}
                </Tree>
              </Spin>
            </Col>
            <Col span={16} push={2}>
              <Card>
                <div className="clearfix">
                  <h3 style={{ float: 'left' }}>{title}</h3>
                  {!OrgIdLoading && title !== '未选择部门' ? (
                    <Tooltip placement="top" title="新增">
                      <a style={{ float: 'right' }} onClick={() => this.addRole()}>
                        <Icon type="plus-square" style={{ fontSize: 14 }} />
                      </a>
                    </Tooltip>
                  ) : null}
                </div>
                <div style={{ marginTop: '18px',height: 'calc(100vh - 400px)' }}>
                  {title === '未选择部门' ? (
                    <Empty description={false} />
                  ) : (
                    <Spin spinning={OrgIdLoading}>
                      <Table
                        rowKey="userId"
                        columns={this.columns}
                        dataSource={userInfo}
                        scroll={{ y: 240 }}
                        pagination={false}
                      />
                    </Spin>
                  )}
                </div>
              </Card>
            </Col>
          </Card>
        </Row>
        <Modal
          title={userId ? '编辑权限' : '权限分配'}
          width={720}
          visible={roleVisible}
          onCancel={this.roleHideModal}
          maskClosable={false}
          footer={null}
        >
          <Form>
            <Form.Item label="找人" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <Row>
                <Col span={22}>
                  <AutoComplete
                    dataSource={searchData}
                    onSearch={debounce(this.onSearch, 1000)}
                    onSelect={this.onSelect}
                    placeholder="请输入人员姓名"
                    value={sendUserName}
                    onChange={this.autoChange}
                    disabled={!!userId}
                  />
                </Col>
                <Col span={1} push={1}>
                  {!!userId ? null : (
                    <Tooltip placement="top" title="通讯录找人">
                      <a>
                        <Icon type="solution" style={{ fontSize: 18 }} onClick={this.showDrawee} />
                      </a>
                    </Tooltip>
                  )}
                </Col>
              </Row>
            </Form.Item>
            {roleVisible ? (
              <Form.Item label="权限分配" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                {forUseLoading && userId ? (
                  <Spin />
                ) : (
                  <RoleTransfer
                    treeData={authList}
                    onTransfer={this.onTransfer}
                    roleType="user"
                  ></RoleTransfer>
                )}
              </Form.Item>
            ) : null}
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.handleSubmit} loading={submitLoading}>
                提交
              </Button>{' '}
              &emsp;
              <Button onClick={this.roleHideModal}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="该人员权限"
          visible={eyeVisible}
          onCancel={this.hideEyeModal}
          maskClosable={false}
          footer={null}
        >
          {forUseLoading ? (
            <Spin />
          ) : roleList.length ? (
            <Descriptions bordered>
              <Descriptions.Item label="人员权限" span={3}>
                {roleList.join(',')}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="该角色暂无权限" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          )}
        </Modal>
        <AddressBook
          drawerVisible={drawerVisible}
          onDrawerClose={this.onDrawerClose}
          onAddressChange={this.onAddressChange}
        />
      </>
    );
  }
}
export default index;
