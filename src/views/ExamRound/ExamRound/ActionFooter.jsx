import React from 'react'
import { Button, Modal } from 'antd'
import * as examRoundAction from 'src/actions/examRound'
import { useDispatch } from 'react-redux'
import { RoundStatus, CertificateCategory } from 'src/utils/const'
import { buildResult } from '../helper'
import { getAllRounds } from 'src/actions/app'
import useUnmount from 'src/hooks/useUnmount'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

const ActionFooter = ({
  roundNum,
  examRound,
  examFinish,
  clearExamResult,
  handleSelectPrint,
  setClearMultSelect,
  finishExam,
  canPlay,
  isGradeMode,
  delExamResults,
}) => {
  const dispatch = useDispatch()
  const { executionInfo, headerInfo, examResult = [] } = examRound
  const examPaused = headerInfo.examState === RoundStatus.pause.id
  const examIsOnGoing = headerInfo.examState === RoundStatus.ongoing.id

  const confirmFinishExam = () => {
    confirm({
      title: '请问您确认要结束考试吗?',
      onOk: () => finishExam(),
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  // 有需要打印成绩单的学生
  const hasReport = examResult.some(
    (item) => item.isPass && item.isStatisticalValue
  )
  // 有需要打印补考单的学生
  const hasExam = examResult.some(
    (item) => !item.isPass && item.isStatisticalValue
  )

  const startExam = () => {
    if (examPaused) {
      dispatch(examRoundAction.resumeExam(executionInfo.executionId))
    } else {
      dispatch(examRoundAction.startExam(roundNum))
    }
  }

  const pauseExam = async () => {
    await dispatch(
      examRoundAction.pauseExam(buildResult(examRound, isGradeMode))
    )
    dispatch(getAllRounds())
  }

  useUnmount(() => {
    const { headerInfo } = examRound
    if (headerInfo.examState === RoundStatus.ongoing.id) {
      pauseExam()
    }
  })

  /**
   * 这里投影的是下一场的
   */
  const openNextGroupWindow = () => {
    window.open(
      `${process.env.REACT_APP_URL_ROOT}/next-group`,
      'Data',
      'height=1200,width=900'
    )
  }

  const retakeExam = () => {
    confirm({
      title: '请问您确认要重新考试吗?',
      content: '警告！当前考试成绩会被清零！',
      icon: <ExclamationCircleOutlined />,
      onOk: () => delExamResults(),
      okType: 'danger',
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <div className="exam-round__header-actions">
      {!examFinish && canPlay && (
        <>
          <Button
            disabled={examIsOnGoing}
            type="primary"
            className="exam-start-btn"
            onClick={startExam}
          >
            {examPaused ? '恢复考试' : '开始'}
          </Button>
          <Button
            disabled={examPaused}
            className="exam-pause-btn"
            onClick={pauseExam}
          >
            暂停
          </Button>
          <Button
            disabled={!examPaused && !examIsOnGoing}
            type="danger"
            onClick={confirmFinishExam}
          >
            结束考试
          </Button>
          <Button onClick={openNextGroupWindow}>投影</Button>
          <Button onClick={clearExamResult}>清空成绩</Button>
          <Button onClick={() => setClearMultSelect(true)}>清空多选</Button>
        </>
      )}
      {examFinish && (
        <div>
          {hasReport && (
            <Button
              onClick={() => handleSelectPrint(CertificateCategory.report)}
            >
              打印证书
            </Button>
          )}
          {hasExam && (
            <Button onClick={() => handleSelectPrint(CertificateCategory.exam)}>
              打印补考单
            </Button>
          )}
          <Button onClick={retakeExam} danger>
            重新考试
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActionFooter
