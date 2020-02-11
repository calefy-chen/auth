/**
 * 封装搜索列表与搜索表单，主要处理搜索变化时的数据加载
 *
 * 使用者可以通过ref，调用该组件的 gotoPage(n) 方法，实现对列表分页的控制
 */
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import React, { ComponentType, CSSProperties, ReactNode } from 'react';
import SearchForm, { ISearchFormItem } from './SearchForm';
import SearchList from './SearchList';

interface IDataItem {
  [key: string]: any;
}
interface ISearchListWithFormProps<T> {
  // 搜索表单项
  searchItems: ISearchFormItem[];
  // 操作按钮组件，
  //   支持三种方式其一，如果有多个，优先顺序为：toolbarComponent > toolbarNode > toolbarType
  //   其中只有toolbarNode是放在表单与列表之间的位置，其他两个都是包围列表组件
  toolbarComponent?: ComponentType<any>; // 传递自定义批量操作组件
  toolbarNode?: ReactNode; // 传递自定义操作位置元素
  toolbarType?: 'relaunch' | 'handle' | 'launch'; // 使用预定义批量操作：重发/处置/DQS下发
  toolbarProps?: IDataItem;
  // 表格数据
  columns: Array<ColumnProps<T>>;
  dataSource: T[];
  total: number;
  scrollWidth: number;
  // 重新加载数据
  loading: boolean;
  style?: CSSProperties;
  page?: number;
  pageSize?: number;
  extraQuery?: object; // 搜索项额外搜索值，会在查询时，合并到请求参数中
  loadData(params: object): Promise<any>;
  onExpand?(expanded: boolean, record: T): void;
  expandedRowRender?(record: object): React.ReactNode;
  onRowClick?(record: T, index: number): void; // 用于点击一条后展示详情
}

class SearchListWithForm extends React.PureComponent<ISearchListWithFormProps<IDataItem>> {
  public static defaultProps = {
    pageSize: 10,
  };

  public readonly state = {
    pager: {}, // 分页
    search: {}, // 搜索
    filter: {}, // 筛选
    sorter: {}, // 排序
  };

  // toolbar对应ref，用来重置选中项
  public toolbarRef = React.createRef<any>();

  // 列表对应ref，用来设置列表的分页page
  public listRef = React.createRef<any>();

  // 表单对应ref，用来重置搜索表单
  public formRef = React.createRef<any>();

  constructor(props: ISearchListWithFormProps<IDataItem>) {
    super(props);
    this.state.pager = {
      // 初始搜索列表条件
      page: 1,
      pageSize: props.pageSize,
    };

    this.reloadData = debounce(this.reloadData.bind(this), 150); // 节流函数，防止被多次执行
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  public componentDidMount() {
    this.reloadData();
  }

  public componentDidUpdate(prevProps: ISearchListWithFormProps<IDataItem>, prevState) {
    // 加载数据判断条件
    if (this.state !== prevState) {
      const loadDataKeys = ['pager', 'search', 'filter', 'sorter'];
      for (let i = 0, len = loadDataKeys.length; i < len; i += 1) {
        const key = loadDataKeys[i];
        if (this.state[key] !== prevState[key]) {
          this.reloadData();
          return;
        }
      }
    }
  }

  /**
   * 重置表单，并重新加载数据
   */
  public resetForm() {
    this.formRef.current.resetFields()
    this.handleSearchChange({})
  }

  /**
   * 实际执行重新加载数据
   */
  public reloadData() {
    const { pager, search, filter, sorter } = this.state;
    const { extraQuery, loadData } = this.props;
    const params = { ...extraQuery, ...pager };
    if (!isEmpty(search)) {
      Object.assign(params, search);
    }
    if (!isEmpty(filter)) {
      Object.assign(params, filter);
    }
    if (!isEmpty(sorter)) {
      Object.assign(params, sorter);
    }

    loadData(params);

    // 重新加载数据时，重置选中项
    const component = this.toolbarRef.current;
    if (component) {
      const toolbar = component.getWrappedInstance();
      if (toolbar && toolbar.resetSelected) {
        toolbar.resetSelected();
      }
    }
  }

  /**
   * 以当前条件跳转到某页
   * @param page 目标页码
   */
  public gotoPage(page: number) {
    this.listRef.current.setPage(page);
    const { pager } = this.state;
    this.setState({ pager: { ...pager, page } });
  }

  // 搜索表单变化，不管是否与原来搜索项值相同，只要变化了，都触发搜索
  public handleSearchChange(values: object) {
    this.gotoPage(1);
    this.setState({ search: values });
  }

  // 表格变化，包含分页、筛选、排序
  public handleTableChange(
    pagination: PaginationConfig,
    filter: IDataItem,
    sorter: SorterResult<IDataItem>,
  ) {
    const { pager, sorter: stateSorter } = this.state;
    // 分页
    const newPager = { page: pagination.current, pageSize: pagination.pageSize };
    if (!isEqual(pager, newPager)) {
      this.setState({ pager: newPager });
    }
    // 筛选，暂无需要
    // 排序-每次仅能排序一个(只有排序属性为true，才支持服务端排序)
    if (!isEqual(sorter, stateSorter) && sorter.column && sorter.column.sorter === true) {
      this.setState({
        sorter: sorter.order
          ? {
              sorterOrder: sorter.order,
              sorterField: sorter.field,
            }
          : {},
      });
    } else if (!isEqual(sorter, stateSorter) && sorter.field === 'clientId') {
      // 牛卡号排序重置
      this.setState({
        sorter: {},
      });
    }
  }

  public render() {
    const {
      searchItems,
      columns,
      dataSource,
      total,
      loading,
      toolbarType,
      style,
      scrollWidth,
      pageSize,
      onRowClick,
      toolbarComponent,
      toolbarNode,
      toolbarProps,
      expandedRowRender,
      onExpand,
    } = this.props;
    const { search } = this.state;
    // 标准list
    const listNode = (
      <SearchList
        ref={this.listRef}
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={dataSource}
        total={total}
        loading={loading}
        onChange={this.handleTableChange}
        onRowClick={onRowClick}
        pageSize={pageSize}
        onExpand={onExpand}
        scrollWidth={scrollWidth}
      />
    );

    // toolbar
    let searchListNode = listNode;
    let Toolbar = null;
    if (toolbarComponent) {
      // 优先使用自定义toolbar部分
      Toolbar = toolbarComponent;
    } else if (toolbarNode) {
      // 次优先直接插入显示toolbar
      searchListNode = (
        <>
          {toolbarNode}
          {listNode}
        </>
      );
    } else if (toolbarType) {
      
    }
    if (Toolbar) {
      // 如果有组件，则包围listNode
      const props = {
        search,
        onEnd: () => this.gotoPage(1),
        ...toolbarProps,
      };
      searchListNode = (
        <Toolbar ref={this.toolbarRef} {...props}>
          {listNode}
        </Toolbar>
      );
    }

    return (
      <div style={style}>
        <SearchForm ref={this.formRef} items={searchItems} expand={true} onSearch={this.handleSearchChange} />

        {searchListNode}
      </div>
    );
  }
}

export default SearchListWithForm;
