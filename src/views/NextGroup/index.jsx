import React, { useEffect, useState } from 'react'
import './index.less'
import { Avatar, Button } from 'antd'
import { getDomain, addNumPrefix } from 'src/utils/common'
import api from 'src/utils/api'

const NextGroup = ({ match }) => {
  const { roundNumOrder } = match.params
  const [nextGroup, setNextGroup] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.get(`/exam/nextRound`)
      setNextGroup(result)
    }
    fetchData()
  }, [setNextGroup])

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
              场次: {addNumPrefix(roundNumOrder)}
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
