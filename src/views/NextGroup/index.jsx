import './index.less'

import { Avatar } from 'antd'
import React, { useEffect, useState } from 'react'
import useFetch from 'src/hooks/useFetch'
import logo from 'src/images/home_logo.png'
import { getDomain } from 'src/utils/common'
import { examRoundBroadcast } from 'src/utils/const'
import { scoreToGrade } from 'src/views/ExamRound/helper'

const leftIndexs = [0, 1, 2, 3, 4]
const rightIndexs = [5, 6, 7, 8, 9]

const NextGroup = () => {
  const [examRound, setExamRound] = useState()
  const [nextGroup, refetch] = useFetch(`/exam/nextRound`)
  const { studentList = [] } = examRound || {}

  useEffect(() => {
    examRoundBroadcast.onmessage = function (ev) {
      setExamRound(ev.data)
      console.log(333, ev.data)
    }
    return () => examRoundBroadcast.close()
  }, [])

  // 30秒间隔获取最新的下一轮次数据
  useEffect(() => {
    let id = setInterval(() => {
      refetch()
    }, 30000)
    return () => clearInterval(id)
  }, [refetch])

  return (
    <div className="next-group">
      <div className="next-group-header">
        <img src={logo} alt={logo} />
      </div>
      <div className="next-group-content">
        <div className="content-container left-content">
          {leftIndexs.map((index) => {
            const student = studentList[index]
            return (
              <StudentResult
                student={student || {}}
                key={index}
                index={index + 1}
                grades={examRound?.grades}
              />
            )
          })}
        </div>
        <div className="middle-content"></div>
        <div className="content-container right-content"></div>
      </div>
    </div>
  )
}

export default NextGroup

const StudentResult = ({ index, student, grades }) => {
  let grade = null
  if (student.totalScore) {
    grade = scoreToGrade(student.totalScore, grades)
  }
  return (
    <div className="student-result">
      <div className="student-result-number">{index}</div>
      <div className="student-result-avatar">
        <Avatar size={90} src={`${getDomain()}${student.faceUrl}`} />
      </div>
      <div className="student-result-item">
        <span>{student.studentName}</span>
        <span>{grade?.name}</span>
      </div>
    </div>
  )
}
