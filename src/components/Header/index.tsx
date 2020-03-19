import React, { useCallback } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Menu, Dropdown, Icon,Row, Col } from 'antd';
import styles from './index.less';
import logo from '@/assets/logo.png';

interface HeaderProps {
  user: any;
  location:any;
  logout(): Promise<any>;
}

const Header = ({ user,location, logout }: HeaderProps) => {
  const onLogout = useCallback(() => {
    logout();
    // setTimeout(() => {
    //   router.push('/user/login');
    // }, 0);
  }, []);
  const menu = (
    <Menu>
      <Menu.Item>
        <a>
          退出登录
        </a>
      </Menu.Item>
    </Menu>
  );
  const routeList = [
    {name:'函件中心',path:'/letter'},
    {name:'任务管理',path:'/task'},
    {name:'处理统计',path:'/statistics'},
  ]
  console.log(user,location,'xxxx')
  return (
    <div className={styles.header}>
      <Col span={8}>
        <Link to="/">
          <img src={logo} alt="logo" width="327" height="22" />
        </Link>
      </Col>
      <Col span={5} offset={9}>
        <nav>
          {
            routeList.map(item => (
              <Link to={item.path} key={item.path} className={item.path === location.pathname? styles.active:styles.link}>{item.name}</Link>
            ))
          }
        </nav>
      </Col>


      <Col span={2}>
        <div style={{float:'right'}}>
        <Dropdown overlay={menu}>
          <a style={{color:'#333333'}}>
            <Icon type="user" />&nbsp;&nbsp;
            张三&nbsp;
            <Icon type="caret-down" />
          </a>
        </Dropdown>
        </div>
      </Col>
    </div>
  );
};

export default connect(null, dispatch => ({
  logout: () => dispatch({ type: 'user/logout' }),
}))(Header);
