import React from 'react'
import { Modal, Avatar, Button, Table } from 'antd'
import { getDomain } from 'src/utils/common'

const MakeupsModal = ({
  hideMakeupsModal,
  makeupStudents,
  addMakeupStudToRound,
}) => {
  return (
    <Modal
      title={`选择要添加到本场考试的考生`}
      visible={true}
      onCancel={hideMakeupsModal}
      footer={[
        <Button key="cancel" onClick={hideMakeupsModal}>
          取消
        </Button>,
      ]}
    >
      <Table
        columns={getColumns(addMakeupStudToRound)}
        dataSource={makeupStudents}
        rowKey="studentId"
        size="middle"
        bordered={true}
      />
    </Modal>
  )
}

export default MakeupsModal

const getColumns = (addMakeupStudToRound) => [
  {
    title: '序号',
    key: 'index',
    render: (text, record, index) => `${index + 1}`,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '照片',
    render: (text, record) => (
      <Avatar size={50} src={`${getDomain()}${record.faceUrl}`} />
    ),
  },
  {
    title: '操作',
    render: (text, record) => {
      if (record.added) {
        return <span>已添加</span>
      }
      return (
        <Button
          type="primary"
          onClick={() => addMakeupStudToRound(record.studentGroupId)}
        >
          添加
        </Button>
      )
    },
  },
]
