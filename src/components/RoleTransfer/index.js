import React from 'react';
import { Transfer, Tree } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
const { TreeNode } = Tree;

const obj = {role:'角色',permission: '权限', route: '菜单' };

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

// 递归渲染treeNode
const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode
      {...props}
      disabled={checkedKeys.includes(props.id.toString())}
      key={props.id}
      title={props.name}
    >
      {generateTree(children, checkedKeys)}
    </TreeNode>
  ));
};

// 渲染treeTransfer组件
const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = [];
  // 生成右边框里的总数据函数
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push({ key: item.id.toString(), title: item.name });
      flatten(item.children);
    });
  }
  Object.keys(dataSource[0]).map(item => {
    flatten(dataSource[0][item]);
  });
  return (
    <Transfer
      {...restProps}
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
          Object.keys(obj).map(item => {
            authList[item] = dataSource[0][item];
          });
          return (
            <div>
              {Object.keys(authList).map((item,index) => {
                return (
                  <div key={index}>
                    <h3>{obj[item]}</h3>
                    <Tree
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
                      {generateTree(authList[item], targetKeys)}
                    </Tree>
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
  dispatch => ({
  }),
)
class Index extends React.Component {
  static propTypes={
    treeData:PropTypes.object.isRequired,
    onTransfer:PropTypes.func,
    roleType:PropTypes.string
  }
  static defaultProps = {
    roleType:'role'
  }
  state = {
    targetKeys: [],
  };
  componentDidMount() {
    const {forRoleData,roleType,forUserData} = this.props
    if(roleType==='role'){
      this.setState({targetKeys:forRoleData})
    }else{
      this.setState({targetKeys:forUserData})
    }

  }
  onChange = targetKeys => {
    const {onTransfer} = this.props
    this.setState({ targetKeys });
    onTransfer(targetKeys)
  };

  render() {
    const { targetKeys } = this.state;
    const { treeData } = this.props;
    return (
      <div>
          <TreeTransfer dataSource={[treeData]} targetKeys={targetKeys} onChange={this.onChange} />
      </div>
    );
  }
}
export default Index;
