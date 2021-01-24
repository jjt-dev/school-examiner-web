import './index.less'

import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Empty, Tooltip } from 'antd'
import Button from 'antd/es/button'
import set from 'lodash/fp/set'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from 'src/utils/api'
import { addNumPrefix } from 'src/utils/common'

import { findRoundStatus } from '../helper'
import MakeupsModal from './MakeupsModal'
import RoundModal from './RoundModal'
import useFetch from 'src/hooks/useFetch'

const ExamRoundList = ({ history }) => {
  const { examInfo } = useSelector((state) => state.app)
  const [examRoundList = [], fetchRounds] = useFetch(`/exam/roundList`)
  const [examMakeupRoundList = [], fetchMakeupRounds] = useFetch(
    `/exam/makeupRoundList`
  )
  const [makeupCount, fetchMakeupCount] = useFetch(`/exam/examMakeUpCount`)
  const hasMakeups = examMakeupRoundList.length > 0

  return (
    <div className="page exam-round-list">
      <div className="exam-round-list__title">
        <span>{examInfo?.title}</span>
      </div>
      <div className="resource-pool-btn">
        <Button onClick={() => history.push(`/resource-pool`)} type="primary">
          待考列表 ({makeupCount})
        </Button>
      </div>
      {examRoundList.length > 0 && (
        <RoundList
          roundList={examRoundList}
          history={history}
          fetchRounds={fetchRounds}
          fetchMakeupRounds={fetchMakeupRounds}
          makeupCount={makeupCount}
          fetchMakeupCount={fetchMakeupCount}
        />
      )}
      {hasMakeups && (
        <RoundList
          roundList={examMakeupRoundList}
          history={history}
          isMakeup
          fetchRounds={fetchRounds}
          fetchMakeupRounds={fetchMakeupRounds}
          makeupCount={makeupCount}
          fetchMakeupCount={fetchMakeupCount}
        />
      )}
      {!examRoundList.length && !examMakeupRoundList.length && (
        <Empty className="exam-round-list__empty"></Empty>
      )}
    </div>
  )
}

export default ExamRoundList

const RoundList = ({
  roundList,
  history,
  isMakeup,
  fetchRounds,
  fetchMakeupRounds,
  makeupCount,
  fetchMakeupCount,
}) => {
  const [selectedRoundForAdd, setSelectedRoundForAdd] = useState()
  const [selectedRoundForRemove, setSelectedRoundForRemove] = useState()
  const [makeupStudents, setMakeupStudents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(`/exam/examMakeUpPage?page=1&rows=100000`)
      setMakeupStudents(result.data)
    }
    if (selectedRoundForAdd) {
      fetchData()
    }
  }, [selectedRoundForAdd])

  const getAllRounds = () => {
    fetchRounds()
    fetchMakeupRounds()
  }

  const addMakeupStudToRound = async (student) => {
    const { id } = student
    await api.get(`/exam/addUnexamStudentToRound`, {
      toRoundNum: selectedRoundForAdd.roundNum,
      makeupId: id,
    })
    const studentIndex = makeupStudents.findIndex((item) => item.id === id)
    setMakeupStudents(set(`[${studentIndex}].added`, true, makeupStudents))
    getAllRounds()
    fetchMakeupCount()
  }

  const openModal = (e, round, type) => {
    e.preventDefault()
    e.stopPropagation()
    type === 'add'
      ? setSelectedRoundForAdd(round)
      : setSelectedRoundForRemove(round)
  }

  const hideModal = () => {
    setSelectedRoundForAdd()
    setSelectedRoundForRemove()
  }

  const goToRound = (roundNum) => {
    if (!selectedRoundForAdd && !selectedRoundForRemove) {
      history.push(`/exam-round/${roundNum}`)
    }
  }

  return (
    <div className="exam-round-list__content">
      {roundList.map((item) => {
        const roundStatus = findRoundStatus(item.currState)
        const isFinish = roundStatus.key === 'finish'
        return (
          <div
            key={item.roundNum}
            className={`exam-round-list__content-grid round-status--${roundStatus.key}`}
            onClick={() => goToRound(item.roundNum)}
          >
            {item.canAdd && (
              <Tooltip title="添加考生到该场次">
                <PlusOutlined onClick={(e) => openModal(e, item, 'add')} />
              </Tooltip>
            )}
            <div className="round-number">
              {isMakeup
                ? `${addNumPrefix(item.roundNumOrder)}-补考`
                : addNumPrefix(item.roundNumOrder)}
            </div>
            <div className="round-level">
              考生数: {item.studentCount}
              {!isFinish && (
                <EditOutlined
                  onClick={(e) => openModal(e, item, 'remove')}
                  className="edit-student-icon"
                />
              )}
            </div>
            {roundStatus.icon}
            <div className="round-title">{roundStatus.title}</div>
          </div>
        )
      })}
      {selectedRoundForAdd && (
        <MakeupsModal
          makeupStudents={makeupStudents}
          hideModal={hideModal}
          addMakeupStudToRound={addMakeupStudToRound}
        />
      )}
      {selectedRoundForRemove && (
        <RoundModal
          hideModal={hideModal}
          roundNum={selectedRoundForRemove.roundNum}
          getAllRounds={getAllRounds}
          fetchMakeupCount={fetchMakeupCount}
        />
      )}
    </div>
  )
}
