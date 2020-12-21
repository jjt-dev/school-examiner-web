import './index.less'

import { message, Tag } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Prompt } from 'react-router-dom'
import { getAllRounds } from 'src/actions/app'
import * as examRoundAction from 'src/actions/examRound'
import api from 'src/utils/api'
import { examRoundBroadcast, RoundStatus } from 'src/utils/const'

import { buildResult } from '../helper'
import ActionBar from './ActionBar'
import ActionFooter from './ActionFooter'
import CertifStudentModal from './CertifStudentModal'
import CountDown from './CountDown'
import ExamResult from './ExamResult'

const ExamRound = ({ match, history }) => {
  const dispatch = useDispatch()
  // 为了解决拖拽选择组件不更新的问题，用toggleResult在两个Result组件之间进行切换，当需要更新的时候就改变toggleResult的值
  const [toggleResult, setToggleResult] = useState(false)
  const [isGradeMode, setIsGradeMode] = useState(false)
  const [showCertifStudentsModal, setShowCertifStudentsModal] = useState(false)
  const [clearMultSelect, setClearMultSelect] = useState(false)
  const [certificateCat, setCertificateCat] = useState({})
  const [roundNumOrder, setRoundNumOrder] = useState()
  const { roundNum } = match.params
  const { examRoundList, examMakeupRoundList } = useSelector(
    (state) => state.app
  )
  const { examRound } = useSelector((state) => state.examRound)
  const headerInfo = examRound?.headerInfo || {}
  const leaveMessage = '离开该页面当前考试将暂停。'
  const examFinish = headerInfo.examState === RoundStatus.finish.id
  const examOngoing = headerInfo.examState === RoundStatus.ongoing.id
  const examRoundLoaded = examRound && headerInfo.roundNum === Number(roundNum)
  const examLevels = Array.from(
    new Set(examRound?.studentList.map((item) => item.levelName) || [])
  )

  useEffect(() => {
    dispatch(getAllRounds())
    return () => dispatch(examRoundAction.clearExam())
  }, [dispatch])

  useEffect(() => {
    setToggleResult((pre) => !pre)
    examRoundBroadcast.postMessage(examRound)
  }, [examRound])

  const getExamRound = useCallback(() => {
    dispatch(examRoundAction.getExamRound(roundNum))
  }, [dispatch, roundNum])

  useEffect(() => {
    getExamRound()
  }, [getExamRound])

  useEffect(() => {
    const currentRoundList = roundNum < 0 ? examMakeupRoundList : examRoundList
    const round =
      currentRoundList.find((item) => item.roundNum === Number(roundNum)) || {}
    setRoundNumOrder(round.roundNumOrder)
  }, [examMakeupRoundList, examRoundList, roundNum])

  const selectRound = (roundNum) => history.push(`/exam-round/${roundNum}`)

  const updateStudent = (studentId, field, value) => {
    dispatch(examRoundAction.updateStudent(studentId, field, value))
  }

  const updateResult = (student, itemId, score) => {
    dispatch(examRoundAction.updateResult(student, itemId, score))
  }

  const updateResultBatch = (params) => {
    dispatch(examRoundAction.updateResultBatch(params))
  }

  const handleSetGradeMode = (value) => {
    setIsGradeMode(value)
    setToggleResult(!toggleResult)
  }

  const finishExam = async () => {
    const result = await api.post(
      `/exam/finishExam`,
      buildResult(examRound, isGradeMode)
    )
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

  const delExamResults = async () => {
    await api.post(`/exam/delExamResults?roundNum=${roundNum}`)
    message.success('当前考试成绩成功清零')
    getExamRound()
  }

  return (
    <>
      <Prompt when={examOngoing} message={() => leaveMessage} />
      {examRoundLoaded && (
        <>
          <div className="fix-header">
            <div className="exam-round__header">
              {roundNumOrder && (
                <ActionBar
                  roundNum={roundNum}
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
                    {examLevels.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
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
                finishExam={finishExam}
                canPlay={headerInfo.canPlay}
                isGradeMode={isGradeMode}
                delExamResults={delExamResults}
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
