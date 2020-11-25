import React from 'react'
import { Menu, Input } from 'antd'
import { gradeToScore } from 'src/utils/common'

const { Search } = Input

const getContextMenu = (grades, handleChangeScore, isGradeMode) => {
  if (isGradeMode) {
    return (
      <Menu>
        <Menu.Item>
          <div>请输入分数</div>
          <div onClick={(e) => e.stopPropagation()}>
            <Search
              enterButton="确定"
              type="number"
              min={1}
              max={100}
              size="small"
              onSearch={(score) => handleChangeScore(score)}
            />
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <Menu>
      {grades.map((grade) => (
        <Menu.Item
          key={grade.id}
          onClick={() => handleChangeScore(gradeToScore(grade.id, grades))}
        >
          {grade.name}
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default getContextMenu
