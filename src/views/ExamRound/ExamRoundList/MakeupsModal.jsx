import React from 'react'
import { Modal, Avatar, Button, Table } from 'antd'
import {
  getDomain,
  getRow,
  tableOrder,
  getCustomRow,
  findResPoolStatus,
  findResPoolSource,
} from 'src/utils/common'

const MakeupsModal = ({ hideModal, makeupStudents, addMakeupStudToRound }) => {
  return (
    <Modal
      width={1000}
      title={`选择要添加到本场考试的考生`}
      visible={true}
      onCancel={hideModal}
      footer={[
        <Button key="cancel" onClick={hideModal}>
          取消
        </Button>,
      ]}
    >
      <Table
        columns={getColumns(addMakeupStudToRound)}
        dataSource={makeupStudents}
        size="small"
        rowKey="id"
        bordered={true}
      />
    </Modal>
  )
}

export default MakeupsModal

const getColumns = (addMakeupStudToRound) => [
  tableOrder,
  getRow('姓名', 'studentName'),
  getRow('身份证号', 'cardId'),
  getCustomRow('头像', (record) => (
    <Avatar size={30} src={`${getDomain()}${record.faceUrl}`} />
  )),
  getRow('报考等级', 'levelName'),
  getCustomRow(
    '当前状态',
    (record) => findResPoolStatus(record.currState).title
  ),
  getCustomRow(
    '来源方式',
    (record) => findResPoolSource(record.createWay).title
  ),
  {
    title: '操作',
    render: (text, record) => {
      if (record.added) {
        return <span>已添加</span>
      }
      return (
        <Button
          size="small"
          type="primary"
          onClick={() => addMakeupStudToRound(record)}
        >
          添加
        </Button>
      )
    },
  },
]
