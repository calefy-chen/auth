import React, { Component } from 'react';
import { Form, Select, Input, Button, message, Modal } from 'antd';
import { connect } from 'dva';
import { SYSTEM_WARN } from '@/const/base';

@connect(
  ({ system, loading }) => ({
    systemType: system.systemType,
    alarmBigList: system.alarmBigList,
    alarmMinList: system.alarmMinList,
    updataLoading: loading.effects['system/updateSystemAlarm'],
    addLoading: loading.effects['system/addSystemAlarm'],
  }),
  dispatch => ({
    updateAlarm: params => dispatch({ type: 'system/updateSystemAlarm', payload: params }),
    addAlarm: params => dispatch({ type: 'system/addSystemAlarm', payload: params }),
  })
)
@Form.create()
class SumbitForm extends Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      form: { resetFields },
      type
    } = this.props;
    if (prevProps.type !== type) {
      resetFields();
    }
  }

  handleAdd() {
    const { form, onEnd, onClose, addAlarm } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        addAlarm(values).then(res => {
          if (res.code) {
            message.success('处理成功');
            onClose();
            if (onEnd) {
              onEnd();
            }
          }
        });
      }
    });
  }

  handleSubmit() {
    const { form, alarmId, onEnd, updateAlarm } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          alarmId,
        };
        updateAlarm(params).then(res => {
          if (res.code) {
            message.success('处理成功');
            if (onEnd) {
              onEnd();
            }
          }
        });
      }
    });
  }

  updataForm() {
    const {
      form: { getFieldDecorator, updataLoading },
    } = this.props;
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="处理人" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('disUsr', {
            rules: [
              { required: true, message: '请输入处理人' },
              { pattern: /^[^\s]*$/, message: '禁止输入空格' },
              { max: 10, message: '长度不超过10个字符' },
            ],
          })(<Input placeholder="请输入处理人" allowClear />)}
        </Form.Item>
        <Form.Item label="是否被投诉" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('cmpFlag', {
            initialValue: '',
            rules: [{ required: true, message: '请选择是否被投诉' }],
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {SYSTEM_WARN.FLAG.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="是否误报" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('mireport', {
            initialValue: '',
            rules: [{ required: true, message: '请选择是否误报' }],
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {SYSTEM_WARN.FLAG.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="是否已处理" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('disFlag', {
            initialValue: '',
            rules: [{ required: true, message: '请选择是否已处理' }],
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {SYSTEM_WARN.FLAG.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="处理信息">
          {getFieldDecorator('disDetail', {
            rules: [
              { required: true, message: '请输入处理信息' },
              { max: 1000, message: '长度不超过1000个字符' },
            ],
          })(<Input.TextArea placeholder="请输入处理信息" rows={4} style={{ marginTop: 5 }} />)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 18, offset: 4 }} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSubmit} loading={updataLoading}>
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }

  addForm() {
    const {
      form: { getFieldDecorator, getFieldValue, addLoading },
      systemType,
      alarmBigList,
      alarmMinList,
    } = this.props;
    const isDisFlag = getFieldValue('disFlag') === '1'
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="来源系统" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('alarmSource', {
            initialValue: '',
            rules: [{ required: true, message: '请选择来源系统' }],
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {systemType.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="来源IP" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('sourceIp', {
            rules: [{ required: true, message: '请输入来源IP' }],
          })(<Input placeholder="请输入来源IP" allowClear />)}
        </Form.Item>
        <Form.Item label="预警大类" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('alarmType', {
            initialValue: '',
            rules: [{ required: true, message: '请选择预警大类' }],
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {alarmBigList.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="预警分类" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('subType', {
            initialValue: '',
            rules: [{ required: true, message: '请选择预警分类' }],
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {alarmMinList.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="预警摘要" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('alarmTitle', {
            rules: [
              { required: true, message: '请输入预警摘要' },
              { max: 20, message: '长度不超过20个字符' },
            ],
          })(<Input placeholder="请输入预警摘要" allowClear />)}
        </Form.Item>
        <Form.Item label="预警内容" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('alarmDesc', {
            rules: [
              { required: true, message: '请输入预警内容' },
              { max: 20, message: '长度不超过20个字符' },
            ],
          })(<Input placeholder="请输入预警内容" allowClear />)}
        </Form.Item>
        <Form.Item label="是否被投诉" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('cmpFlag', {
            initialValue: '',
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {SYSTEM_WARN.FLAG.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="是否处理" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
          {getFieldDecorator('disFlag', {
            initialValue: '',
          })(
            <Select size="small" dropdownMatchSelectWidth={false}>
              <Select.Option value="">--请选择--</Select.Option>
              {SYSTEM_WARN.FLAG.map(item => (
                <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {isDisFlag && (
          <>
            <Form.Item label="处理人" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
              {getFieldDecorator('disUsr', {
                rules: [
                  { required: isDisFlag, message: '请输入处理人' },
                  { pattern: /^[^\s]*$/, message: '禁止输入空格' },
                  { max: 10, message: '长度不超过10个字符' },
                ],
              })(<Input placeholder="请输入处理人" allowClear />)}
            </Form.Item>
            <Form.Item label="处理信息">
              {getFieldDecorator('disDetail', {
                rules: [
                  { required: isDisFlag, message: '请输入处理信息' },
                  { max: 1000, message: '长度不超过1000个字符' }
                ],
              })(<Input.TextArea placeholder="请输入处理信息" rows={4} style={{ marginTop: 5 }} />)}
            </Form.Item>
          </>  
        )}
        <Form.Item wrapperCol={{ span: 18, offset: 4 }} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleAdd} loading={addLoading}>
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { type, onClose, noModal } = this.props;
    // 无弹窗直接渲染修改表单
    if (noModal) {
      return this.updataForm();
    }

    return (
      <Modal
        visible={!!type}
        title="添加"
        width={800}
        centered={false}
        footer={null}
        onCancel={onClose}
      >
        {this.addForm()}
      </Modal>
    );
  }
}
export default SumbitForm;
