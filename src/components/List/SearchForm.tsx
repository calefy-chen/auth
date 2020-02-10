/**
 * 搜索列表。
 * 通过指定已有元素进行设置要展示哪些项及其展示顺序；
 *
 * 使用方式：
 *    <SearchFrom
 *      items={[
 *        {
 *          name: 'abc',
 *          label: '展示字段',
 *          type: SearchForm.INPUT,
 *          options: ... // 传递给getDecorator的配置
 *          data: ... // 要传递给type方法的数据，即直传给控件的数据
 *        }
 *      ]}
 *      onSearch={() => {}}
 *    />
 */
import {
  SYSTEM_WARN,
} from '@/const/base';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select } from 'antd';
import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import isUndefined from 'lodash/isUndefined';
import React, { ReactNode, useState } from 'react';

import { SelectProps } from 'antd/lib/select';
import styles from './index.less';

// 表单项结构定义
export interface ISearchFormItem {
  name: string;
  label: string;
  options?: GetFieldDecoratorOptions;
  data?: any; // 传递给type方法的数据
  type?: (data?: any, doSearch?: () => void) => ReactNode;
}

// 组件props定义
export interface ISearchFormProps {
  items: ISearchFormItem[];
  expand?: boolean; // 默认展开状态，默认为false

  form: WrappedFormUtils;
  onSearch(values?: object): void; // 搜索时，将表单值传递过去
}

// select option 数据结构定义
interface ISelectOption {
  name: ReactNode;
  value: string | number;
}

/**
 * 过滤表单对象，只取已定义的
 * @param values 要过滤的对象
 */
function filterObject(values: object) {
  const r = {};
  Object.keys(values).forEach((k: string) => {
    if (!isUndefined(values[k])) {
      r[k] = values[k];
    }
  });
  return r;
}

/**
 * 搜索表单区域组件
 * @param param0 传入props
 */
function SearchForm({ items, expand: propsExpand = false, onSearch, form }: ISearchFormProps) {
  const needExpand = items.length > SearchForm.EXPAND_MAZ_NUM; // 是否需要使用expand控制，过少则强制设为expand: false
  const [expand, setExpand] = useState(needExpand ? propsExpand : false);
  const { getFieldDecorator } = form;

  const formClassName = [styles.searchForm, expand ? styles.expanded : styles.unexpanded].join(' ');
  const formSubmit = () => onSearch(filterObject(form.getFieldsValue()));
  const formReset = () => {
    form.resetFields();
    onSearch({});
  };
  return (
    <Form className={formClassName}>
      <Row className={styles.items} gutter={[0, 12]}>
        {items.map((item, index) => {
          const { name, label, type = SearchForm.INPUT, options = {}, data } = item;
          return (
            <Col key={index} className={styles.item} sm={24} md={12} xl={8} xxl={6}>
              <div className={styles.label}>{label}:</div>
              <div className={styles.input}>
                {getFieldDecorator(name, options)(
                  type === SearchForm.INPUT ? type(data, formSubmit) : type(data),
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      <div className={styles.buttons}>
        <Button type="primary" onClick={formSubmit}>
          查询
        </Button>

        {expand ? (
          <Button type="default" onClick={formReset} style={{ marginLeft: 10 }}>
            重置
          </Button>
        ) : null}

        {items.length <= SearchForm.EXPAND_MAZ_NUM ? null : (// 表单项不超过3个则不用收缩展示
          <Button
            type="link"
            size="small"
            className={styles.link}
            onClick={() => setExpand(!expand)}
          >
            {expand ? '收起' : '展开'}
            <Icon type={expand ? 'up' : 'down'} style={{ marginLeft: 5 }} />
          </Button>
        )}
      </div>
    </Form>
  );
}

/**
 * 渲染标准Select
 * @param list 下拉选项
 * @param needAllOption 是否包含“全部”项，默认包含
 */
function renderSelect(
  list: Array<{ name: ReactNode; value: string | number }>,
  needAllOption: boolean = true,
  props?: SelectProps,
) {
  return (
    <Select placeholder="请选择" allowClear {...props}>
      {needAllOption ? <Select.Option value="">全部</Select.Option> : null}
      {list.map((item, index) => (
        <Select.Option key={index} value={item.value}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
}

// 不显示展开按钮的表单项数阈值
SearchForm.EXPAND_MAZ_NUM = 3;

// 设置搜索表单各个表单项
SearchForm.INPUT = (data: any, doSearch?: () => void) => (
  <Input placeholder="请输入" allowClear onPressEnter={doSearch} />
); // 输入框
SearchForm.SELECT = (options: ISelectOption[]) => renderSelect(options);
SearchForm.DATE_RANGE = (props: any) => (
  <DatePicker.RangePicker style={{ width: '100%' }} allowClear {...props} />
); // 日期范围

SearchForm.SELECT_FLAG = () => renderSelect(SYSTEM_WARN.FLAG); // 是或否选择

export default Form.create<ISearchFormProps>()(SearchForm);
