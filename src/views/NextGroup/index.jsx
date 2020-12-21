import './index.less'

import React, { useEffect, useState } from 'react'
import useFetch from 'src/hooks/useFetch'
import { examRoundBroadcast } from 'src/utils/const'
import logo from 'src/images/home_logo.png'

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
    <div className="next-group">
      <div className="next-group-header">
        <img src={logo} alt={logo} />
      </div>
      <div className="next-group-content">
        <div className="left-content"></div>
        <div className="middle-content"></div>
        <div className="right-content"></div>
      </div>
    </div>
  )
}

export default NextGroup
