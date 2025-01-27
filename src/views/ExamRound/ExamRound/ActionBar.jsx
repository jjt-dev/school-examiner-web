import React from 'react'
import { Select, Checkbox } from 'antd'
import { getRoundTitle } from '../helper'

const ActionBar = ({
  roundNum,
  roundNumOrder,
  examRoundList,
  examMakeupRoundList,
  selectRound,
  isGradeMode,
  setIsGradeMode,
  examRound,
  examFinish,
}) => {
  const defaultValue = `${roundNum < 0 ? '补考-' : ''}${getRoundTitle(
    roundNumOrder
  )}`
  return (
    <div className={`exam-round__header-action exam-finish-${examFinish}`}>
      <span className="exam-round__header-action-round-select">场次</span>
      <Select
        style={{ width: '100px' }}
        defaultValue={defaultValue}
        onChange={(value) => selectRound(value)}
      >
        {examRoundList.map((round) => (
          <Select.Option key={round.roundNum} value={round.roundNum}>
            {getRoundTitle(round.roundNumOrder)}
          </Select.Option>
        ))}
        {examMakeupRoundList.map((round) => (
          <Select.Option key={round.roundNum} value={round.roundNum}>
            补考-{getRoundTitle(round.roundNumOrder)}
          </Select.Option>
        ))}
      </Select>
      <span className="exam-round__header-action-mode">分数模式</span>
      <Checkbox
        checked={isGradeMode}
        onChange={() => setIsGradeMode(!isGradeMode)}
      />
    </div>
  )
}

export default ActionBar
