import './index.less'

import { Avatar } from 'antd'
import React from 'react'
import PageList from 'src/components/PageList'
import {
  findResPoolSource,
  findResPoolStatus,
  getCustomRow,
  getDateRow,
  getDomain,
  getRow,
  tableOrder,
} from 'src/utils/common'

const ResourcePool = () => {
  return (
    <PageList
      showAdd={false}
      columns={getColumns}
      title={`资源池`}
      path="/exam/examMakeUpPage"
      size="small"
    />
  )
}

export default ResourcePool

const getColumns = () => [
  tableOrder,
  getRow('姓名', 'studentName'),
  getRow('身份证号', 'cardId'),
  getCustomRow('头像', (record) => (
    <Avatar size={45} src={`${getDomain()}${record.faceUrl}`} />
  )),
  getRow('报考等级', 'levelName'),
  getDateRow('报名时间', 'createTime'),
  getCustomRow(
    '当前状态',
    (record) => findResPoolStatus(record.currState).title
  ),
  getCustomRow(
    '来源方式',
    (record) => findResPoolSource(record.createWay).title
  ),
]
