import React from 'react';
import { Transfer, Tree,ConfigProvider,Empty } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import './index.css'
import zhCN from 'antd/es/locale/zh_CN';
const { TreeNode } = Tree;


// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

// 递归渲染treeNode
const generateTree = (treeNodes = [], checkedKeys = [], disabledId = '') => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode
      {...props}
      disabled={checkedKeys.includes(props.id.toString()) || props.id.toString() === disabledId}
      key={props.id}
      title={props.name}
    >
      {generateTree(children, checkedKeys, disabledId)}
    </TreeNode>
  ));
};

// 渲染treeTransfer组件
const TreeTransfer = ({ dataSource, targetKeys, disabledId,showKey,topTitle, ...restProps }) => {
  const transferDataSource = [];
  // 生成右边框里的总数据函数
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push({ key: item.id.toString(), title: item.name });
      flatten(item.children);
    });
  }
  Object.keys(dataSource[0]).forEach(item => {
    flatten(dataSource[0][item]);
  });
  return (
    <Transfer
      {...restProps}
      titles={topTitle}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      render={item => item.title}
      className="tree-transfer"
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          const authList = {};
          Object.keys(showKey).forEach(item => {
            authList[item] = dataSource[0][item];
          });
          return (
            <div>
              {Object.keys(authList).map((item, index) => {
                return (
                  <div key={index}>
                    <h3>{showKey[item]}</h3>
                    {authList[item].length? <Tree
                      blockNode
                      checkable
                      checkStrictly
                      defaultExpandAll
                      checkedKeys={checkedKeys}
                      onCheck={(
                        _,
                        {
                          node: {
                            props: { eventKey },
                          },
                        },
                      ) => {
                        onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                      }}
                      onSelect={(
                        _,
                        {
                          node: {
                            props: { eventKey },
                          },
                        },
                      ) => {
                        onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                      }}
                    >
                      {generateTree(authList[item], targetKeys, disabledId)}
                    </Tree>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无'+showKey[item]} />}

                  </div>
                );
              })}
            </div>
          );
          // });
        }
      }}
    </Transfer>
  );
};

@connect(
  ({ authAssign }) => ({
    forRoleData: authAssign.forRoleData,
    forUserData: authAssign.forUserData,
  }),
  dispatch => ({}),
)
class Index extends React.Component {
  static propTypes = {
    treeData: PropTypes.object.isRequired,
    onTransfer: PropTypes.func,
    roleType: PropTypes.string,
    showKey:PropTypes.object,
    topTitle:PropTypes.array
  };
  static defaultProps = {
    roleType: 'role',
    showKey:{ role: '角色', permission: '权限', route: '菜单' },
    topTitle:['全部权限','已分配权限']
  };
  state = {
    targetKeys: [],
  };
  componentDidUpdate(pre) {
    const { forRoleData, roleType,forUserData } = this.props;
    if(pre.forRoleData !== forRoleData ||pre.forUserData !== forUserData ){
      if (roleType === 'role') {
        this.setState({ targetKeys: forRoleData });
      }else{
        this.setState({ targetKeys: forUserData });
      }
    }
  }
  onChange = targetKeys => {
    const { onTransfer } = this.props;
    this.setState({ targetKeys });
    onTransfer(targetKeys);
  };

  render() {
    const { targetKeys } = this.state;
    const { treeData, disabledId,showKey,topTitle } = this.props;
    return (
      <div className="treesfer">
        <ConfigProvider locale={zhCN}>
        <TreeTransfer
          disabledId={disabledId}
          dataSource={[treeData]}
          targetKeys={targetKeys}
          showKey={showKey}
          topTitle={topTitle}
          onChange={this.onChange}
        />
        </ConfigProvider>
      </div>
    );
  }
}
export default Index;
