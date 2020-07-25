import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './index.less'
import * as examRoundAction from 'src/actions/examRound'
import ActionBar from './ActionBar'
import CountDown from './CountDown'
import ExamResult from './ExamResult'
import ActionFooter from './ActionFooter'
import { Prompt } from 'react-router-dom'
import { message } from 'antd'
import { RoundStatus } from 'src/utils/const'
import CertifStudentModal from './CertifStudentModal'
import api from 'src/utils/api'
import { getFinishExamPayload } from '../helper'
import * as appAction from 'src/actions/app'

const ExamRound = ({ match, history }) => {
  const dispatch = useDispatch()
  // 为了解决拖拽选择组件不更新的问题，用toggleResult在两个Result组件之间进行切换，当需要更新的时候就改变toggleResult的值
  const [toggleResult, setToggleResult] = useState(false)
  const [isGradeMode, setIsGradeMode] = useState(false)
  const [showCertifStudentsModal, setShowCertifStudentsModal] = useState(false)
  const [clearMultSelect, setClearMultSelect] = useState(false)
  const [certificateCat, setCertificateCat] = useState({})
  const { roundNum } = match.params
  const { examRoundList, examMakeupRoundList } = useSelector(
    (state) => state.app
  )
  const { roundNumOrder } =
    examRoundList.find((item) => item.roundNum === Number(roundNum)) || {}
  const { examRound } = useSelector((state) => state.examRound)
  const leaveMessage = '离开该页面会导致正在进行中或暂停的考试数据丢失。'
  const examFinish = examRound?.headerInfo.examState === RoundStatus.finish.id
  const examOngoing = examRound?.headerInfo.examState === RoundStatus.ongoing.id

  useEffect(() => {
    dispatch(appAction.getExamRoundList())
    dispatch(appAction.getExamMakeupRoundList())
  }, [dispatch])

  useEffect(() => {
    if (examOngoing) {
      window.onbeforeunload = () => leaveMessage
    }
    return () => (window.onbeforeunload = null)
  }, [examOngoing])

  useEffect(() => {
    setToggleResult((pre) => !pre)
  }, [examRound])

  const getExamRound = useCallback(() => {
    dispatch(examRoundAction.getExamRound(roundNum))
  }, [dispatch, roundNum])

  useEffect(() => {
    getExamRound()
  }, [getExamRound])

  const selectRound = (roundNum) => history.push(`/exam-round/${roundNum}`)

  const updateStudent = (studentId, field, value) => {
    dispatch(examRoundAction.updateStudent(studentId, field, value))
  }

  const updateResult = (studentId, itemId, score) => {
    dispatch(examRoundAction.updateResult(studentId, itemId, score))
  }

  const updateResultBatch = (params) => {
    dispatch(examRoundAction.updateResultBatch(params))
  }

  const handleSetGradeMode = (value) => {
    setIsGradeMode(value)
    setToggleResult(!toggleResult)
  }

  const finishExam = async () => {
    const payload = getFinishExamPayload(examRound)
    const result = await api.post(`/exam/finishExam`, {
      executeId: examRound.executionInfo.executionId,
      result: payload,
    })
    await dispatch(examRoundAction.finishExam(result))
    getExamRound()
    message.success('考试保存成功')
  }

  const clearExamResult = () => {
    dispatch(examRoundAction.clearExamResult())
    setToggleResult(!toggleResult)
  }

  const handleSelectPrint = (category) => {
    setShowCertifStudentsModal(true)
    setCertificateCat(category)
  }

  return (
    <>
      <Prompt when={examOngoing} message={() => leaveMessage} />
      {examRound && (
        <>
          <div className="fix-header">
            <div className="exam-round__header">
              {roundNumOrder && (
                <ActionBar
                  roundNumOrder={roundNumOrder}
                  selectRound={selectRound}
                  examRoundList={examRoundList ?? []}
                  examMakeupRoundList={examMakeupRoundList ?? []}
                  isGradeMode={isGradeMode}
                  setIsGradeMode={handleSetGradeMode}
                  examFinish={examFinish}
                  examRound={examRound}
                />
              )}
              <div className="exam-round__header-middle">
                {!examFinish && (
                  <CountDown {...examRound} finishExam={finishExam} />
                )}
                {examFinish && (
                  <div className="exam-round__header-middle-level">
                    考试结果
                  </div>
                )}
                {examFinish && (
                  <div className="exam-round__header-middle-level">
                    <span>级别:</span>
                    {examRound.headerInfo.levelName}
                    {examRound.headerInfo.levelAlias}
                  </div>
                )}
              </div>
              <ActionFooter
                roundNum={roundNum}
                examRound={examRound}
                examFinish={examFinish}
                clearExamResult={clearExamResult}
                handleSelectPrint={handleSelectPrint}
                setClearMultSelect={setClearMultSelect}
              />
            </div>
          </div>
          <div className="page exam-round">
            <ExamResult
              examRound={examRound}
              updateStudent={updateStudent}
              updateResult={updateResult}
              updateResultBatch={updateResultBatch}
              isGradeMode={isGradeMode}
              toggleResult={toggleResult}
              setToggleResult={setToggleResult}
              examFinish={examFinish}
              clearMultSelect={clearMultSelect}
              setClearMultSelect={setClearMultSelect}
            />
            {showCertifStudentsModal && (
              <CertifStudentModal
                setShowCertifStudentsModal={setShowCertifStudentsModal}
                certificateCat={certificateCat}
                examRound={examRound}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ExamRound
