/*
 * @Author: 王硕
 * @Date: 2020-02-05 17:34:45
 * @LastEditors  : 王硕
 * @LastEditTime : 2020-02-05 19:09:29
 * @Description: file content
 */
import React, { Component } from 'react'
import DragTreeTable from '@/components/treeTable/DragTreeTable'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

export default class index extends Component {
  render() {
    return (
      <>
        <DragTreeTable columns={columns}/>
      </>
    )
  }
}
