import React, { useState } from 'react'
import { InputNumber, Menu, Dropdown, Button } from 'antd'

// 不合格，合格，中等，良好，优秀
const defaultGradeScores = [40, 60, 70, 80, 90]

const GradeEdit = ({ examFinish, defaultValue, changeScore, itemColor }) => {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (newValue) => {
    setValue(newValue)
    changeScore(newValue)
  }

  const menu = (
    <Menu onClick={(item) => handleChange(Number(item.key))}>
      {defaultGradeScores.map((grade) => (
        <Menu.Item key={grade}>{grade}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div className="grade-score-edit">
      <InputNumber
        style={{ color: itemColor }}
        disabled={examFinish}
        min={1}
        max={100}
        value={value}
        onChange={handleChange}
      />
      <Dropdown overlay={menu}>
        <Button>
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </Button>
      </Dropdown>
    </div>
  )
}

export default GradeEdit
