import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Empty, Tooltip } from 'antd'
import './index.less'
import { findRoundStatus, getRoundTitle } from '../helper'
import MakeupsModal from './MakeupsModal'
import api from 'src/utils/api'
import set from 'lodash/fp/set'
import { PlusOutlined } from '@ant-design/icons'
import { getAllRounds } from 'src/actions/app'
import Button from 'antd/es/button'

const ExamRoundList = ({ history }) => {
  const dispatch = useDispatch()
  const { examInfo, examRoundList, examMakeupRoundList } = useSelector(
    (state) => state.app
  )
  const hasMakeups = examMakeupRoundList.length > 0

  useEffect(() => {
    dispatch(getAllRounds())
  }, [dispatch])

  return (
    <div className="page exam-round-list">
      <div className="exam-round-list__title">
        <span>{examInfo?.title}</span>
      </div>
      {examRoundList.length > 0 && (
        <RoundList roundList={examRoundList} history={history} />
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

const RoundList = ({ roundList, history }) => {
  const dispatch = useDispatch()
  const [showMakeupsModal, setShowMakeupsModal] = useState(false)
  const [selectedRound, setSelectedRound] = useState()
  const [makeupStudents, setMakeupStudents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(`/exam/examMakeUpPage?page=1&rows=100000`)
      setMakeupStudents(result.data)
    }
    if (selectedRound) {
      fetchData()
    }
  }, [selectedRound])

  const addMakeupStudToRound = async (student) => {
    const { studentGroupId } = student
    await api.get(`/exam/addUnexamStudentToRound`, {
      studentGroupId,
      toRoundNum: selectedRound.roundNum,
      makeupId: student.id,
    })
    const studentIndex = makeupStudents.findIndex(
      (item) => item.studentGroupId === studentGroupId
    )
    setMakeupStudents(set(`[${studentIndex}].added`, true, makeupStudents))
    dispatch(getAllRounds())
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
      <Button
        onClick={() => history.push(`/resource-pool`)}
        type="primary"
        className="resource-pool-btn"
      >
        资源池
      </Button>
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
                <PlusOutlined onClick={(e) => openMakeupsModal(e, item)} />
              </Tooltip>
            )}
            <div className="round-number">
              {getRoundTitle(item.roundNumOrder)}
            </div>
            <div className="round-level">{item.levelName}</div>
            <div className="round-level">考生数: {item.studentCount}</div>
            {roundStatus.icon}
            <div className="round-title">{roundStatus.title}</div>
          </div>
        )
      })}
      {showMakeupsModal && (
        <MakeupsModal
          makeupStudents={makeupStudents}
          hideMakeupsModal={hideMakeupsModal}
          addMakeupStudToRound={addMakeupStudToRound}
        />
      )}
    </div>
  )
}
