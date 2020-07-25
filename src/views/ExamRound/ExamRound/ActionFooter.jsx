import React from 'react'
import { Button } from 'antd'
import * as examRoundAction from 'src/actions/examRound'
import { useDispatch } from 'react-redux'
import { RoundStatus, CertificateCategory, PassScore } from 'src/utils/const'

const ActionFooter = ({
  roundNum,
  nextRoundNumOrder,
  examRound,
  examFinish,
  clearExamResult,
  handleSelectPrint,
  setClearMultSelect,
}) => {
  const dispatch = useDispatch()
  const { executionInfo, headerInfo, examResult } = examRound
  const examPaused = headerInfo.examState === RoundStatus.pause.id
  const examIsOnGoing = headerInfo.examState === RoundStatus.ongoing.id

  // 有需要打印成绩单的学生
  const hasReport = (examResult || []).some(
    (item) => item.isStatisticalValue && item.score >= PassScore
  )
  // 有需要打印补考单的学生
  const hasExam = (examResult || []).some(
    (item) => item.isStatisticalValue && item.score < PassScore
  )

  const startExam = () => {
    if (examPaused) {
      dispatch(examRoundAction.resumeExam(executionInfo.executionId))
    } else {
      dispatch(examRoundAction.startExam(roundNum))
    }
  }

  const pauseExam = () => {
    dispatch(examRoundAction.pauseExam(executionInfo.executionId))
  }

  /**
   * 这里投影的是下一场的
   */
  const openNextGroupWindow = () => {
    window.open(
      `${process.env.REACT_APP_URL_ROOT}/next-group/${nextRoundNumOrder}`,
      'Data',
      'height=1200,width=900'
    )
  }

  return (
    <div className="exam-round__header-actions">
      {!examFinish ? (
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
          <Button onClick={openNextGroupWindow}>投影</Button>
          <Button onClick={clearExamResult}>清空成绩</Button>
          <Button onClick={() => setClearMultSelect(true)}>清空多选</Button>
        </>
      ) : (
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
        </div>
      )}
    </div>
  )
}

export default ActionFooter