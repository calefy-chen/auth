/*
 * @Author: 王硕
 * @Date: 2020-02-13 10:02:58
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-14 21:15:10
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
    projectId: project.projectDetail.id,
    branchVo: authAssign.branchVo,
    BranchLoading: loading.effects['authAssign/queryBranchVo'],
    OrgIdLoading: loading.effects['authAssign/getByOrgId'],
    submitLoading: loading.effects['authAssign/authAssignToUser'],
    forUseLoading: loading.effects['authAssign/getAuthAssignForUser'],
    userMsg: authAssign.userMsg,
    authData: auth.authList,
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
        render: (text, recard) => <a onClick={() => this.editRole(recard)}>编辑权限</a>,
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
      console.log(res);
      this.setState({
        searchData: res.data.map(item => (
          <Option key={item.oaCode + '-' + item.name}>{item.name}</Option>
        )),
      });
    });
  };
  onSelect = value => {
    console.log('onSelect', value);
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
    });
    getByOrgId({ orgId: bmId });
  };
  handleSubmit = () => {
    const { authAssignToUser, projectId } = this.props;
    const { sendUserId, sendUserName, userRoleData, bmId } = this.state;
    if (!sendUserId) {
      message.error('请选择人员');
    } else {
      console.log(projectId, 'projectId');
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
    console.log(data, '---->');
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
      userMsg,
      submitLoading,
      authData,
    } = this.props;
    const { title, roleVisible, searchData, userId, sendUserName, drawerVisible } = this.state;
    console.log(this.state.userRoleData, '------');
    return (
      <>
        <Row>
          <Card>
            <Col span={6} style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
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
                <div style={{ marginTop: '18px' }}>
                  {title === '未选择部门' ? (
                    <Empty description={false} />
                  ) : (
                    <Spin spinning={OrgIdLoading}>
                      <Table
                        rowKey="userId"
                        columns={this.columns}
                        dataSource={userMsg}
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
                    placeholder="请选择人员姓名"
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
                    treeData={authData}
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
