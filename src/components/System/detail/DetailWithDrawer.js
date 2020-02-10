/*
 * @Author: 林骏宏
 * @Date: 2020-01-15 16:10:54
 * @LastEditors  : 林骏宏
 * @LastEditTime : 2020-01-16 14:40:54
 * @Description: file content
 */

/**
 * 详情入口
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer } from 'antd';
import Detail from './index';

@connect(({ details, loading }) => ({ ...details, loading }))
class DrawerComponent extends Component {
  constructor() {
    super();
    this.hideModal = this.hideModal.bind(this);
  }

  // 详情盒子隐藏方法
  hideModal() {
    const { dispatch, hideModal } = this.props;
    dispatch({ type: 'details/cleanData' });
    if (hideModal) {
      hideModal();
    }
  }

  render() {
    const { onEnd, id } = this.props;

    return (
      <Drawer
        visible={!!id}
        closable={false}
        width={900}
        bodyStyle={{
          padding: 16,
          background: '#f6f9fb',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        destroyOnClose
        onClose={this.hideModal}
      >
        {id ? <Detail id={id} onEnd={onEnd} /> : null}
      </Drawer>
    );
  }
}

export default DrawerComponent;
