/**
 * 搜索列表，默认配置上了分页、scroll、部分选择项等，方便直接渲染搜索列表
 */
import { Table } from 'antd';
import {
  ColumnProps,
  PaginationConfig,
  SorterResult,
  TableCurrentDataSource,
  TableRowSelection,
} from 'antd/lib/table';
import React from 'react';

// type SelectedType = Array<string|number>
export interface ISearchListProps<T> {
  columns: Array<ColumnProps<T>>;
  dataSource: T[];
  total: number;
  scrollWidth?: number; // 指定scroll.x值，不指定则使用默认值
  loading?: boolean;
  // onSelectChange?(selected: SelectedType, setSelected: (selected: SelectedType) => void): void, // 行被选中变化
  // checkboxProps?(record: T): Object,
  rowSelection?: TableRowSelection<T>;
  pageSize?: number;
  onChange(
    pagination: PaginationConfig,
    filters: Record<keyof T, string[]>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>,
  ): void;
  onRowClick?(record: T, index: number): void; // 点击一行
  onExpand?(expanded: boolean, record: T): void;
  expandedRowRender?(record: object): React.ReactNode;
}
class SearchList extends React.PureComponent<ISearchListProps<object>> {
  public state = {
    page: 1,
    pageSize: 10,
  };

  constructor(props: ISearchListProps<object>) {
    super(props);
    this.state.pageSize = props.pageSize || 10;
    this.setPage = this.setPage.bind(this);
    this.setPageSize = this.setPageSize.bind(this);
  }

  /**
   * 跳转到第几页
   * @param page 页码
   */
  public setPage(page: number) {
    this.setState({ page });
  }
  public setPageSize(page: number, pageSize: number) {
    this.setState({ pageSize });
  }
  public render() {
    const {
      columns,
      dataSource,
      loading,
      total,
      scrollWidth,
      onChange,
      onRowClick,
      rowSelection,
      onExpand,
      expandedRowRender,
    } = this.props;
    const { page, pageSize } = this.state;
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          total,
          current: page,
          pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          hideOnSinglePage: false,
          showTotal: (t: number) => `共 ${t} 条`,
          onChange: this.setPage,
          onShowSizeChange: this.setPageSize,
        }}
        scroll={{
          x: scrollWidth || columns.length * 190,
          y: 500,
        }}
        onChange={onChange}
        onRow={(record, index) => ({
          onClick: () => onRowClick && onRowClick(record, index),
        })}
        onExpand={onExpand}
        expandedRowRender={expandedRowRender}
        rowSelection={
          // onSelectChange ?
          // {
          //   selectedRowKeys: selected,
          //   getCheckboxProps: checkboxProps || null,
          //   onChange: (selected: SelectedType) => {setSelected(selected); onSelectChange(selected, setSelected);}
          // }
          rowSelection ? rowSelection : null}
      />
    );
  }
}

export default SearchList;
