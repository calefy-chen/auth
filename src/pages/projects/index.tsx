/*
 * @Author: 王硕
 * @Date: 2020-02-06 12:31:20
 * @LastEditors: 王硕
 * @LastEditTime: 2020-02-20 15:40:48
 * @Description: file content
 */
/**
 * 项目列表页
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Icon, Row, Col, Modal, message, Spin, Tooltip, Empty } from 'antd';
import Link from 'umi/link';
import isEmpty from 'lodash/isEmpty';
import { connect, router } from 'dva';
import styles from './index.css';
import ProjectForm from '@/components/ProjectForm';
import { delProject } from '@/services/project';

const { confirm } = Modal;

// 项目组件接收的props
interface ProjectsProps {
  lists: Array<{ id: string | number; name: string; code: string }>;
  loading: boolean;
  fetchList(): Promise<any>;
  delProject(payload: { id: string }): Promise<any>;
}

function Projects({ lists, loading, fetchList, delProject }: ProjectsProps) {
  const [visible, setVisible] = useState(false); // 设置弹窗
  const [projectDetail, setProjectDetail] = useState(null); // 设置编辑值

  useEffect(() => {
    if (isEmpty(lists)) {
      fetchList();
    }
  }, []);

  const showModal = useCallback((item = null) => {
    setVisible(true);
    setProjectDetail(item);
  }, []);

  // 关闭弹窗
  const hideModal = useCallback(() => {
    setVisible(false);
    setProjectDetail(null);
  }, []);

  const onEditEnd = useCallback(() => {
    setVisible(false);
    fetchList();
  }, []);

  // 删除
  const handleDel = useCallback(item => {
    confirm({
      title: `您确认要删除${item.name}吗？`,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        delProject({ id: item.id }).then((res: { code: number }) => {
          if (res.code === 200) {
            message.success('删除成功');
            fetchList();
          } else {
            message.error(res.message);
          }
        });
      },
    });
  }, []);

  // 加载当前项目期间，loading
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 120 }}>
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div style={{ background: '#ECECEC', padding: '30px',minHeight:'240px' }}>
      <Row gutter={[16, 16]}>
        {lists.map(item => (
          <Col span={8} key={item.id}>
            <Card
              className={styles.card}
              hoverable
              actions={[
                <Tooltip placement="top" title="编辑">
                  <Icon type="edit" key="edit" onClick={() => showModal(item)} />
                </Tooltip>,
                <Tooltip placement="top" title="删除">
                  <Icon type="delete" key="del" onClick={() => handleDel(item)} />
                </Tooltip>,
              ]}
            >
              <Link to={`/projects/${item.id}`} style={{ color: '#333' }}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.str}>{item.code}</p>
              </Link>
            </Card>
          </Col>
        ))}
        {lists.length ? (
          <Col span={8}>
            <Card className={styles.addBtn} hoverable onClick={() => showModal()}>
              <Tooltip placement="top" title="新建项目">
                <Icon type="plus" style={{ fontSize: 30 }} />
              </Tooltip>
            </Card>
          </Col>
        ) : (
          <Empty
            imageStyle={{
              height: 80,
              marginTop:30
            }}
            description={
              <span>
                当前尚无项目<a onClick={() => showModal()} style={{fontSize:'14px',color:'#238dd9'}}>[创建项目]</a>
              </span>
            }
          ></Empty>
        )}
      </Row>

      <Modal
        title={projectDetail?.id ? '编辑项目' : '创建项目'}
        visible={visible}
        onCancel={hideModal}
        maskClosable={false}
        footer={null}
      >
        <ProjectForm cancel={hideModal} onEditEnd={onEditEnd} projectDetail={projectDetail} />
      </Modal>
    </div>
  );
}

export default connect(
  ({ project, loading }: any) => ({
    lists: project.projectList,
    loading: loading.effects['project/getProjectList'],
  }),
  dispatch => ({
    fetchList: () => dispatch({ type: 'project/getProjectList' }),
    delProject: (payload: { id: string }) => dispatch({ type: 'project/delProject', payload }),
  }),
)(Projects);
