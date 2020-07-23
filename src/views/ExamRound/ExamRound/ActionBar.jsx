import React from 'react'
import { Select, Checkbox } from 'antd'
import { getRoundTitle } from '../helper'

const ActionBar = ({
  roundNum,
  examRoundList,
  examMakeupRoundList,
  selectRound,
  isGradeMode,
  setIsGradeMode,
}) => {
  const totalRoundList = examRoundList.concat(examMakeupRoundList)

  return (
    <div className="exam-round__action">
      <span className="exam-round__action-round-select">场次</span>
      <Select
        style={{ width: '100px' }}
        defaultValue={getRoundTitle(roundNum)}
        onChange={(value) => selectRound(value)}
      >
        {totalRoundList.map((round) => (
          <Select.Option key={round.roundNum} value={round.roundNum}>
            {getRoundTitle(round.roundNum)}
          </Select.Option>
        ))}
      </Select>
      <span className="exam-round__action-mode">分数模式</span>
      <Checkbox
        checked={isGradeMode}
        onChange={() => setIsGradeMode(!isGradeMode)}
      />
    </div>
  )
}

export default ActionBar
