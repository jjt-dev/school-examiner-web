import React, { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon, Empty, Tooltip } from 'antd'
import './index.less'
import { findRoundStatus, getRoundTitle } from '../helper'
import { useEffect } from 'react'
import * as appAction from 'src/actions/app'
import MakeupsModal from './MakeupsModal'
import api from 'src/utils/api'
import set from 'lodash/fp/set'

const ExamRoundList = ({ history }) => {
  const dispatch = useDispatch()
  const { examInfo, examRoundList, examMakeupRoundList } = useSelector(
    (state) => state.app
  )
  const hasMakeups = examMakeupRoundList.length > 0

  const getRoundList = useCallback(() => {
    dispatch(appAction.getExamRoundList())
    dispatch(appAction.getExamMakeupRoundList())
  }, [dispatch])

  useEffect(() => {
    getRoundList()
  }, [getRoundList])

  return (
    <div className="page exam-round-list">
      <div className="exam-round-list__title">
        <span>{examInfo?.title}</span>
      </div>
      {examRoundList.length > 0 && (
        <RoundList
          roundList={examRoundList}
          history={history}
          getRoundList={getRoundList}
        />
      )}
      {hasMakeups && (
        <RoundList roundList={examMakeupRoundList} history={history} />
      )}
      {!examRoundList.length && !examMakeupRoundList.length && (
        <Empty className="exam-round-list__empty"></Empty>
      )}
    </div>
  )
}

export default ExamRoundList

const RoundList = ({ roundList, history, getRoundList }) => {
  const [showMakeupsModal, setShowMakeupsModal] = useState(false)
  const [selectedRound, setSelectedRound] = useState()
  const [makeupStudents, setMakeupStudents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(
        `/exam/getUnexamStudent?roundNum=${selectedRound.roundNum}`
      )
      setMakeupStudents(result)
    }
    if (selectedRound) {
      fetchData()
    }
  }, [selectedRound])

  const addMakeupStudToRound = async (studentGroupId) => {
    await api.get(`/exam/addUnexamStudentToRound`, {
      studentGroupId,
      toRoundNum: selectedRound.roundNum,
    })
    const studentIndex = makeupStudents.findIndex(
      (item) => item.studentGroupId === studentGroupId
    )
    setMakeupStudents(set(`[${studentIndex}].added`, true, makeupStudents))
    getRoundList()
  }

  const openMakeupsModal = (e, round) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedRound(round)
    setShowMakeupsModal(true)
  }

  const hideMakeupsModal = () => {
    setSelectedRound()
    setShowMakeupsModal(false)
  }

  const goToRound = (roundNum) => {
    if (!showMakeupsModal) {
      history.push(`/exam-round/${roundNum}`)
    }
  }

  return (
    <div className="exam-round-list__content">
      {roundList.map((item) => {
        const roundStatus = findRoundStatus(item.currState)
        return (
          <div
            key={item.roundNum}
            className={`exam-round-list__content-grid round-status--${roundStatus.key}`}
            onClick={() => goToRound(item.roundNum)}
          >
            {item.canAdd && (
              <Tooltip title="添加考生到该场次">
                <Icon type="plus" onClick={(e) => openMakeupsModal(e, item)} />
              </Tooltip>
            )}
            <div className="round-number">{getRoundTitle(item.roundNum)}</div>
            <Icon type={roundStatus.icon} />
            <div className="round-title">{roundStatus.title}</div>
            {showMakeupsModal && (
              <MakeupsModal
                makeupStudents={makeupStudents}
                hideMakeupsModal={hideMakeupsModal}
                addMakeupStudToRound={addMakeupStudToRound}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
