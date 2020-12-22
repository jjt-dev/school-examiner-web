import './index.less'

import React, { useEffect, useState } from 'react'
import useFetch from 'src/hooks/useFetch'
import { examRoundBroadcast } from 'src/utils/const'
import logo from 'src/images/home_logo.png'
import { Avatar } from 'antd'
import { getDomain } from 'src/utils/common'
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
        <div className="left-content">
          {leftIndexs.map((index) => {
            const student = studentList[index]
            if (student) {
              return (
                <StudentResult
                  student={student}
                  key={index}
                  index={index + 1}
                />
              )
            }
            return null
          })}
        </div>
        <div className="middle-content"></div>
        <div className="right-content"></div>
      </div>
    </div>
  )
}

export default NextGroup

const StudentResult = ({ index, student }) => {
  return (
    <div className="student-result">
      <div class="student-result-number">{index}</div>
      <div class="student-result-avatar">
        <Avatar size={90} src={`${getDomain()}${student.faceUrl}`} />
      </div>
      <div class="student-result-item"></div>
    </div>
  )
}
