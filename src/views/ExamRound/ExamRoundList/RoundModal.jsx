import { Avatar, Button, Modal, Table } from 'antd'
import React from 'react'
import useFetch from 'src/hooks/useFetch'
import { getDomain, getRow, tableOrder } from 'src/utils/common'

const RoundModal = ({ hideModal, roundNum }) => {
  const [students = []] = useFetch(
    `/exam/examGroupStudents?roundNum=${roundNum}`
  )

  return (
    <Modal
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
        columns={getColumns()}
        dataSource={students}
        rowKey="studentId"
        size="middle"
        bordered={true}
      />
    </Modal>
  )
}

export default RoundModal

const getColumns = (addMakeupStudToRound) => [
  tableOrder,
  getRow('姓名', 'studentName'),
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
