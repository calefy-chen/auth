/**
 * 创建/编辑项目页
 */
import React, { useCallback, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

// 创建/编辑上传参数
interface submitParams {
  id?: number,
  name: string;
  code: string;
  content?: string;
}

// 项目表单组件接收到的props
interface ProjectFormProps {
  editLoading: boolean;
  form: WrappedFormUtils;
  submit(payload: submitParams): Promise<any>;
  cancel: Function;
  onEditEnd: Function;
  projectDetail: submitParams;
}

/**
 * 创建/编辑项目组件
 */
const ProjectForm = ({
  editLoading,
  submit,
  form: { getFieldDecorator, validateFields, resetFields },
  cancel,
  onEditEnd,
  projectDetail
}: ProjectFormProps) => {
  useEffect(() => {
    resetFields()
  }, [projectDetail])

  // 提交
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    validateFields((errors, values) => {
      if (errors) return;
      let parmas = { ...values }
      if (projectDetail?.id) {
        parmas = {
          ...values,
          id: projectDetail.id,
        }
      }
      submit(parmas).then(res => {
        if (res.code === 200) {
          message.success('处理成功');
          onEditEnd()
        }else{
          message.error(res.message);
        }
      });
    });
  }, [projectDetail]);

  // 渲染表单
  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
      <Form.Item label="项目名称" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        {getFieldDecorator('name', {
          initialValue: projectDetail?.name || '',
          rules: [{ required: true, message: '请输入项目名称' }],
        })(<Input placeholder="请输入项目名称" />)}
      </Form.Item>

      <Form.Item label="项目代码" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        {getFieldDecorator('code', {
          initialValue: projectDetail?.code || '',
          rules: [{ required: true, message: '请输入项目代码（全大写英文表示）' }],
        })(<Input placeholder="请输入项目代码（全大写英文表示）" />)}
      </Form.Item>

      <Form.Item label="项目描述" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        {getFieldDecorator('content', {
          initialValue: projectDetail?.content || '',
          rules: [{ max: 500, message: '长度不超过500个字符' },],
        })(<Input.TextArea placeholder={`请输入项目描述`} rows={4} style={{ marginTop: 5 }} />)}
      </Form.Item>

      <Form.Item wrapperCol={{ span: 18, offset: 4 }} style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={handleSubmit} loading={editLoading}>
          提交
        </Button>{' '}
        &emsp;
        <Button onClick={cancel}>取消</Button>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ loading }: any) => ({
    editLoading: loading.effects['project/submitProject'],
  }),
  dispatch => ({
    submit: (payload: submitParams) => dispatch({ type: 'project/submitProject', payload }),
  }),
)(Form.create()(ProjectForm));
