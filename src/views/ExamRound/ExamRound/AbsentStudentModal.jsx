import React from 'react'
import { Modal, Avatar, Button, Table } from 'antd'
import { getDomain } from 'src/utils/common'

const AbsentStudentModal = ({
  setShowAbsentStudentsModal,
  absentStudents,
  addAbsStudentToCurrRound,
}) => {
  return (
    <Modal
      title={`选择要添加到本场考试的考生`}
      visible={true}
      onCancel={() => setShowAbsentStudentsModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowAbsentStudentsModal(false)}>
          取消
        </Button>,
      ]}
    >
      <Table
        columns={getColumns(addAbsStudentToCurrRound)}
        dataSource={absentStudents}
        rowKey="id"
        size="middle"
        bordered={true}
      />
    </Modal>
  )
}

export default AbsentStudentModal

const getColumns = (addAbsStudentToCurrRound) => [
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
    render: (text, record) => (
      <Button
        type="primary"
        onClick={() => addAbsStudentToCurrRound(record.id, record.roundNum)}
      >
        添加到本场考试
      </Button>
    ),
  },
]
