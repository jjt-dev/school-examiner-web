/* eslint-disable jsx-a11y/no-distracting-elements */

import './index.less'

import { Avatar } from 'antd'
import React, { useEffect, useState } from 'react'
import useFetch from 'src/hooks/useFetch'
import logo from 'src/images/home_logo.png'
import { addRoundPrefix, getDomain } from 'src/utils/common'
import { examRoundBroadcast, gradeColorMap, RoundStatus } from 'src/utils/const'
import { scoreToGrade } from 'src/views/ExamRound/helper'
import { local } from 'src/utils/storage'
import { CaretRightOutlined } from '@ant-design/icons'

const leftIndexs = [0, 1, 2, 3, 4]
const rightIndexs = [5, 6, 7, 8, 9]

const NextGroup = () => {
  const [examRound, setExamRound] = useState()
  const [nextGroup, refetch] = useFetch(`/exam/nextRound`)
  const { studentList = [], headerInfo = {} } = examRound || {}
  const examFinish = headerInfo.examState === RoundStatus.finish.id
  const examOngoing = headerInfo.examState === RoundStatus.ongoing.id
  const examOnPause = headerInfo.examState === RoundStatus.pause.id
  const examUninitiated = headerInfo.examState === RoundStatus.uninitiated.id

  console.log(666, examRound)

  useEffect(() => {
    setExamRound(local.getItem('examRound'))
  }, [])

  useEffect(() => {
    examRoundBroadcast.onmessage = function (ev) {
      setExamRound(ev.data)
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
        <div>
          <img src={logo} alt={logo} />
          <span>场次{addRoundPrefix(headerInfo.roundNum)}</span>
        </div>
        <div className="exam-status">
          {examUninitiated && <div>考试未开始</div>}
          {examOngoing && <div>正在考试</div>}
          {examOnPause && <div>考试暂停</div>}
          {examFinish && <div>考试结束</div>}
        </div>
        <div>{headerInfo.roomName}</div>
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
        <div className="middle-content">
          <span>{getLevelName(studentList)}</span>
        </div>
        <div className="content-container right-content">
          {rightIndexs.map((index) => {
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
      </div>
      <Footer grades={examRound?.grades ?? []} nextGroup={nextGroup} />
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
        {grade && (
          <span style={{ color: gradeColorMap[grade.bgColor] }}>
            {grade.name}
          </span>
        )}
      </div>
    </div>
  )
}

const Footer = ({ grades, nextGroup = {} }) => {
  const { headerInfo = {}, studentList = [] } = nextGroup
  return (
    <div className="next-group-footer">
      <div className="grade-list">
        <span style={{ color: 'white' }}>
          <CaretRightOutlined />
        </span>
        {grades.map((grade, index) => (
          <span key={grade.id}>
            <span style={{ color: gradeColorMap[grade.bgColor] }}>
              {grade.name}-{grade.startScore}~{grade.endScore}
            </span>
            {index < grades.length - 1 && (
              <span style={{ color: gradeColorMap[grade.bgColor] }}>, </span>
            )}
          </span>
        ))}
      </div>
      <div className="next-group-students">
        <marquee>
          <span>下一场次{addRoundPrefix(headerInfo.roundNum)}:</span>
          {studentList.map((item, index) => (
            <span key={index}>
              {item.studentName}
              {index < studentList.length - 1 && <span>, </span>}
            </span>
          ))}
        </marquee>
      </div>
    </div>
  )
}

const getLevelName = (studentList) => {
  const levelNames = studentList.map((item) => item.levelName)
  if (levelNames.length === 1) {
    return levelNames[0]
  }
  return '多个级别'
}
