import React, { useState } from 'react'
import { InputNumber, Menu, Dropdown, Button } from 'antd'

const GradeEdit = ({
  examFinish,
  defaultValue,
  changeScore,
  itemColor,
  grades,
}) => {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (newValue) => {
    setValue(newValue)
    changeScore(newValue)
  }

  const menu = (
    <Menu onClick={(item) => handleChange(Number(item.key))}>
      {grades
        .map((grade) => grade.endScore)
        .map((grade) => (
          <Menu.Item key={grade}>{grade}</Menu.Item>
        ))}
    </Menu>
  )

  return (
    <div className="grade-score-edit">
      <InputNumber
        style={{ fontSize: itemColor ? '18px' : '14px' }}
        disabled={examFinish}
        min={1}
        max={100}
        value={value}
        onChange={handleChange}
        className={`grade-${itemColor}`}
      />
      <Dropdown overlay={menu}>
        <Button className={`grade-${itemColor}`}>
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </Button>
      </Dropdown>
    </div>
  )
}

export default GradeEdit
