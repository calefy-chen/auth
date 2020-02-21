/*
 * @Author: 王硕
 * @Date: 2020-02-13 10:02:58
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-21 23:11:47
 * @Description: file content
 */
import React, { Component } from 'react';
import {
  Tag,
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
const obj = { role: '角色', permission: '权限', route: '菜单' };

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
    forOrgLoading: loading.effects['authAssign/forOrgStaff'],
    submitLoading: loading.effects['authAssign/authAssignToUser'],
    forUseLoading: loading.effects['authAssign/getAuthAssignForUser'],
    forRoleLoading:loading.effects['authAssign/getAuthAssignForRole'],
    userInfo: authAssign.userInfo,
    authList: auth.authList,
  }),
  dispatch => ({
    searchUser: payload => dispatch({ type: 'authAssign/searchUser', payload }),
    queryBranchVo: () => dispatch({ type: 'authAssign/queryBranchVo' }),
    getByOrgId: payload => dispatch({ type: 'authAssign/getByOrgId', payload }),
    forOrgStaff: payload => dispatch({ type: 'authAssign/forOrgStaff', payload }),
    authAssignToUser: payload => dispatch({ type: 'authAssign/authAssignToUser', payload }),
    getAuthAssignForRole: payload => dispatch({ type: 'authAssign/getAuthAssignForRole', payload }),
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
        title: '人员Id',
        dataIndex: 'userId',
      },
      {
        title: '人员姓名',
        dataIndex: 'userName',
      },
      {
        title: (
          <>
            角色
            <Tooltip placement="top" title="点击角色名称，可查看其包含的角色、权限及菜单">
              <a>
                <Icon type="question-circle" />
              </a>
            </Tooltip>
          </>
        ),
        width:300,
        dataIndex: 'items',
        render: text => {
          return text.map((item,index) => {
            return (
              <Tag style={{cursor:'pointer',marginBottom:'5px'}} key={index} onClick={() => this.lookRole(item)}>
                {props.authData[item].name}
              </Tag>
            );
          });
        },
      },
      {
        title: '操作',
        render: (text, recard) => {
          return <a onClick={() => this.editRole(recard)}>角色分配</a>;
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
    showTransfer: false,
    roleList: {
      role: [],
      permission: [],
      route: [],
    },
  };
  componentDidMount() {
    const { queryBranchVo, branchVo } = this.props;
    if (!branchVo.length) {
      setTimeout(() => {
        queryBranchVo();
      }, 300);
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
    const { forOrgStaff, projectId } = this.props;
    forOrgStaff({ orgId: key, projectId }).then(res => {});
    this.setState({
      title: e.node.props.title,
      bmId: e.node.props.dataRef.branchNo,
    });
  };
  addRole = () => {
    this.setState({
      roleVisible: true,
      showTransfer: true,
    });
  };
  lookRole = item => {
    const { getAuthAssignForRole, authData } = this.props;
    this.setState({
      eyeVisible: true,
    });
    getAuthAssignForRole(item).then(res => {
      if (res.code === 200) {
        const obj = {
          role:[],
          route:[],
          permission:[]
        };
        res.data.forEach(item => {
          for (const key in authData) {
            if (item.toString() === key) {
              obj[authData[key]['type']].push(authData[key]['name']);
            }
          }
        });
        this.setState({
          roleList: obj,
        });
      }
    });
  };
  hideEyeModal = () => {
    this.setState({
      eyeVisible: false,
    });
    setTimeout(() => {
      this.setState({
        roleList: {
          role: [],
          permission: [],
          route: [],
        },
      });
    }, 300);
  };
  editRole = item => {
    const { projectId, getAuthAssignForUser } = this.props;
    this.setState({
      roleVisible: true,
      showTransfer: true,
      userId: item.userId,
      sendUserName: item.userName,
      sendUserId: item.userId,
    });
    getAuthAssignForUser({
      userId: item.userId,
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
    const { setAuthAssignForUser } = this.props;
    // 清空redux中userRole值
    setAuthAssignForUser([]);
    this.setState({
      roleVisible: false,
    });

    setTimeout(() => {
      this.setState({
        sendUserId: '',
        sendUserName: '',
        userId: '',
        userRoleData: [],
        showTransfer: false,
      });
    }, 200);
  };
  onEditEnd = () => {
    const { bmId } = this.state;
    const { forOrgStaff, projectId } = this.props;
    this.roleHideModal();
    forOrgStaff({ orgId: bmId, projectId });
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
      forOrgLoading,
      forRoleLoading
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
      showTransfer,
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
                  style={{ minHeight: '200px' }}
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
                <div style={{ marginTop: '18px', height: 'calc(100vh - 400px)' }}>
                  {title === '未选择部门' ? (
                    <Empty description={false} />
                  ) : (
                    <Spin spinning={forOrgLoading}>
                      <Table
                        columns={this.columns}
                        dataSource={userInfo}
                        scroll={{ y: 'calc(100vh - 450px)' }}
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
          style={{ top: 20 }}
          visible={roleVisible}
          onCancel={this.roleHideModal}
          maskClosable={false}
          footer={null}
        >
          <Form>
            <Form.Item label="找人" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
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
            {showTransfer ? (
              <Form.Item label="角色分配：" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                <Spin spinning={!!forUseLoading && !!userId}>
                  <RoleTransfer
                    treeData={authList}
                    onTransfer={this.onTransfer}
                    showKey={{ role: '角色' }}
                    topTitle={['全部角色', '已分配角色']}
                    roleType="user"
                  ></RoleTransfer>
                </Spin>
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
          {
            <Spin spinning={forRoleLoading}>
            <Descriptions bordered size="small" style={{ minHeight: '80px' }}>
              {Object.keys(roleList).map((item,index) => {
                return (
                  <Descriptions.Item label={obj[item]} key={index} span={3}>
                    {roleList[item].length
                      ? roleList[item].map((item, index) => {
                          return (
                            <Tag color="geekblue" key={index} style={{ marginBottom: '5px' }}>
                              {item}
                            </Tag>
                          );
                        })
                      : '暂无' + obj[item] + '分配'}
                  </Descriptions.Item>
                );
              })}
              )
            </Descriptions>
            </Spin>
          }
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
