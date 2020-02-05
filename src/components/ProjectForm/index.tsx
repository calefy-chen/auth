/**
 * 创建/编辑项目页
 */
import React, { useCallback, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

// 创建/编辑上传参数
interface editParams {
  id?: number,
  name: string;
  code: string;
  content?: string;
}

// 项目表单组件接收到的props
interface ProjectFormProps {
  editLoading: boolean;
  form: WrappedFormUtils;
  editProject(payload: editParams): Promise<any>;
  hideModal: Function;
  onEditEnd: Function;
  editDetail: editParams;
}

/**
 * 创建/编辑项目组件
 */
const ProjectForm = ({
  editLoading,
  editProject,
  form: { getFieldDecorator, validateFields, resetFields },
  hideModal,
  onEditEnd,
  editDetail
}: ProjectFormProps) => {
  useEffect(() => {
    resetFields()
  }, [editDetail])

  // 提交
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    validateFields((errors, values) => {
      if (errors) return;
      let parmas = { ...values }
      if (editDetail?.id) {
        parmas = {
          ...values,
          id: editDetail.id,
        }
      }
      editProject(parmas).then(res => {
        if (res.code === 200) {
          message.success('处理成功');
          onEditEnd()
        }
      });
    });
  }, [editDetail]);

  const onClose = useCallback(() => {
    hideModal()
  }, [])

  // 渲染表单
  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
      <Form.Item label="项目名称" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        {getFieldDecorator('name', {
          initialValue: editDetail?.name || '',
          rules: [{ required: true, message: '请输入项目名称' }],
        })(<Input placeholder="请输入项目名称" />)}
      </Form.Item>

      <Form.Item label="项目代码" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        {getFieldDecorator('code', {
          initialValue: editDetail?.code || '',
          rules: [{ required: true, message: '请输入项目代码（全大写英文表示）' }],
        })(<Input placeholder="请输入项目代码（全大写英文表示）" />)}
      </Form.Item>

      <Form.Item label="项目描述" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        {getFieldDecorator('content', {
          initialValue: editDetail?.content || '',
          rules: [{ max: 500, message: '长度不超过500个字符' },],
        })(<Input.TextArea placeholder={`请输入项目描述`} rows={4} style={{ marginTop: 5 }} />)}
      </Form.Item>

      <Form.Item wrapperCol={{ span: 18, offset: 4 }} style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={handleSubmit} loading={editLoading}>
          提交
        </Button>{' '}
        &emsp;
        <Button onClick={onClose}>取消</Button>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ loading }: any) => ({
    editLoading: loading.effects['project/editProject'],
  }),
  dispatch => ({
    editProject: (payload: editParams) => dispatch({ type: 'project/editProject', payload }),
  }),
)(Form.create()(ProjectForm));
