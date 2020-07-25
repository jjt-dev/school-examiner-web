import React from 'react'
import { Modal, Avatar, Button } from 'antd'
import { CertificateCategory, PassScore } from 'src/utils/const'
import { getDomain } from 'src/utils/common'
import { useHistory } from 'react-router'

const CertifStudentModal = ({
  setShowCertifStudentsModal,
  certificateCat,
  examRound,
}) => {
  const history = useHistory()
  const { studentList, examResult = [], headerInfo } = examRound

  const availableStudents = studentList.filter((student) => {
    const result = examResult.find(
      (item) => item.studentId === student.studentId && item.isStatisticalValue
    )
    if (certificateCat.key === CertificateCategory.report.key) {
      return result.score >= PassScore
    } else {
      return !result.isEnable || result.score < PassScore
    }
  })

  return (
    <Modal
      width={800}
      title={`选择要打印${certificateCat.title}的学生`}
      visible={true}
      onCancel={() => setShowCertifStudentsModal(false)}
      footer={[
        <Button
          key="ok"
          type="primary"
          onClick={() =>
            history.push(
              `/certificate/${headerInfo.roundNum}?type=${certificateCat.key}`
            )
          }
        >
          全部打印
        </Button>,
        <Button key="cancel" onClick={() => setShowCertifStudentsModal(false)}>
          取消
        </Button>,
      ]}
    >
      <div className="print-students">
        {availableStudents.map((student) => (
          <div
            key={student.studentId}
            className="print-students-item"
            onClick={() =>
              history.push(
                `/certificate/${headerInfo.roundNum}/${student.studentId}?type=${certificateCat.key}`
              )
            }
          >
            <Avatar size={70} src={`${getDomain()}${student.faceUrl}`} />
            <span>{student.studentName}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default CertifStudentModal
