import React, { useEffect, useState } from 'react'
import { findRoundStatus } from '../helper'
import { RoundStatus } from 'src/utils/const'
import { session } from 'src/utils/storage'

const OneMinSeconds = 60

const CountDown = ({ examDuration, headerInfo, finishExam }) => {
  const [deadline, setDeadline] = useState(examDuration)
  const [minutes, setMinutes] = useState(examDuration / OneMinSeconds)
  const [seconds, setSeconds] = useState(0)
  const { examState } = headerInfo

  useEffect(() => {
    const id = setInterval(() => {
      if (examState === RoundStatus.ongoing.id) {
        setDeadline((prev) => (prev === 0 ? 0 : prev - 1))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [examState])

  useEffect(() => {
    setMinutes(Math.floor(deadline / OneMinSeconds))
    setSeconds(deadline % OneMinSeconds)
    session.setItem('examDeadline', deadline)
    if (deadline === 0) {
      finishExam()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])

  const formatTime = (time) => {
    return String(time).length === 1 ? '0' + time : time
  }

  return (
    <div className="exam-round__header-middle-countdown">
      <span className="exam-round__header-middle-countdown-title">倒计时</span>
      <span className="exam-round__header-middle-countdown-minute">
        <span>{formatTime(minutes)}</span>
        <span>分</span>
      </span>
      <span className="exam-round__header-middle-countdown-separator">:</span>
      <span className="exam-round__header-middle-countdown-second">
        <span>{formatTime(seconds)}</span>
        <span>秒</span>
      </span>
      <span className="exam-round__header-middle-countdown-status">
        {findRoundStatus(headerInfo.examState).title}
      </span>
    </div>
  )
}

export default CountDown
