import { Avatar, Button, message, Modal, Table } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { getAllRounds } from 'src/actions/app'
import useFetch from 'src/hooks/useFetch'
import api from 'src/utils/api'
import { getCustomRow, getDomain, getRow, tableOrder } from 'src/utils/common'

const { confirm } = Modal

const RoundModal = ({ hideModal, roundNum }) => {
  const dispatch = useDispatch()
  const [students = [], fetchStudents] = useFetch(
    `/exam/examGroupStudents?roundNum=${roundNum}`
  )

  const removeStudent = (student) => {
    const { studentId, levelId } = student
    confirm({
      title: '请问您确认要把该考生从该场次移出吗?',
      onOk: async () => {
        await api.post(
          `/exam/removeStudentFromExamGroup?roundNum=${roundNum}&studentId=${studentId}&levelId=${levelId}`
        )
        message.success('成功移出考生')
        fetchStudents()
        dispatch(getAllRounds())
      },
    })
  }

  return (
    <Modal
      width={800}
      title="考生列表"
      visible={true}
      onCancel={hideModal}
      footer={[
        <Button key="cancel" onClick={hideModal}>
          取消
        </Button>,
      ]}
    >
      <Table
        columns={getColumns(removeStudent)}
        dataSource={students}
        rowKey={(record) => record.studentId + record.levelId}
        size="small"
        bordered={true}
      />
    </Modal>
  )
}

export default RoundModal

const getColumns = (removeStudent) => [
  tableOrder,
  getRow('姓名', 'studentName'),
  getRow('身份证号', 'cardId'),
  getCustomRow('头像', (record) => (
    <Avatar size={30} src={`${getDomain()}${record.faceUrl}`} />
  )),
  getRow('报考等级', 'levelName'),
  {
    title: '操作',
    render: (text, record) => {
      return (
        <Button type="primary" onClick={() => removeStudent(record)}>
          移出考生
        </Button>
      )
    },
  },
]
