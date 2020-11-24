import './index.less'

import { Avatar, Button, message, Modal } from 'antd'
import React from 'react'
import ListHeader from 'src/components/ListHeader'
import PageList from 'src/components/PageList'
import useTableSearch from 'src/hooks/useTableFetch'
import {
  findResPoolSource,
  findResPoolStatus,
  getCustomRow,
  getDateRow,
  getDomain,
  getRow,
  tableOrder,
} from 'src/utils/common'
import api from 'src/utils/api'

const { confirm } = Modal

const ResourcePool = () => {
  const tableList = useTableSearch(`/exam/examMakeUpPage`)
  const { rowSelection } = tableList
  const selectedStudents = rowSelection.selectedRowKeys

  const createGroup = () => {
    confirm({
      title: '请问您确认把选中的考生创建为新的考试分组吗?',
      onOk: async () => {
        await api.get(
          `/exam/createNewExamGroup?makeupIds=${selectedStudents.join(',')}`
        )
        message.success('成功创建考试分组')
        tableList.fetchTable()
        rowSelection.onChange([])
      },
    })
  }

  return (
    <PageList
      columns={getColumns}
      title="资源池"
      size="small"
      defaultTableList={tableList}
      showRowSelection
    >
      <div className="resource-pool-header">
        <Button
          type="primary"
          disabled={!selectedStudents.length}
          onClick={createGroup}
        >
          新增分组
        </Button>
        <ListHeader
          {...tableList}
          showAdd={false}
          placeholder="请输入查询条件"
        />
      </div>
    </PageList>
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
    (record) => findResPoolStatus(record.currState)?.title
  ),
  getCustomRow(
    '来源方式',
    (record) => findResPoolSource(record.createWay)?.title
  ),
]
