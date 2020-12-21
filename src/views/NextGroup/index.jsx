import './index.less'

import { Avatar, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import useFetch from 'src/hooks/useFetch'
import { addNumPrefix, getDomain } from 'src/utils/common'
import { examRoundBroadcast } from 'src/utils/const'

const NextGroup = () => {
  const [examRound, setExamRound] = useState()
  const [nextGroup, refetch] = useFetch(`/exam/nextRound`)

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
    <div className="page next-group">
      {nextGroup && (
        <>
          <Avatar
            size={90}
            src={`${getDomain()}${nextGroup.headerInfo.schoolLogo}`}
            className="next-group__logo"
          />
          <div className="next-group__list">
            <div className="next-group__list-round">
              场次: {addNumPrefix(nextGroup.headerInfo.roundIndex)}
            </div>
            <div className="next-group__list-title">
              <div className="next-group__list-title--level">
                级别: {nextGroup.headerInfo.levelName}
                {nextGroup.headerInfo.alias}
              </div>
              <div className="next-group__list-title--status">等待考试</div>
            </div>
            <div className="next-group__list-students">
              {nextGroup.studentList.map((student) => (
                <div
                  key={student.studentId}
                  className="next-group__list-students-item"
                >
                  <Avatar size={70} src={`${getDomain()}${student.faceUrl}`} />
                  <span>{student.studentName}</span>
                </div>
              ))}
            </div>
            <div className="next-group__list-close">
              <Button
                type="primary"
                style={{ width: '80px' }}
                onClick={() => window.close()}
              >
                关闭
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NextGroup
