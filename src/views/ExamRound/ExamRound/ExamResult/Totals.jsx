import { EditOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as examRoundAction from 'src/actions/examRound'
import { getTotalScore } from 'src/utils/common'

import { getResultColumns, scoreToGrade } from '../../helper'
import getContextMenu from './ContextMenu'

/**
 * 因为react-table-drag-select的更新有问题，导致综合统计不会更新，这里用Totals组件覆盖
 *
 * @param {*} param0
 */
const Totals = ({
  studentList,
  examItems,
  grades,
  isGradeMode,
  examFinish,
}) => {
  const dispatch = useDispatch()

  const updateTotalResult = (student) => (score) => {
    dispatch(examRoundAction.updateTotalResult(student, score))
  }

  return (
    <table className="exam-round__result-total">
      <tbody>
        <tr>
          <td>综合统计</td>
          {getResultColumns(studentList).map((index) => {
            const student = studentList[index]
            if (!student || student.isEnable === 'false') {
              return <td key={index} />
            }
            const totalScore =
              student.totalScore ?? getTotalScore(student, examItems)
            const result = isGradeMode
              ? totalScore
              : scoreToGrade(totalScore, grades).name
            return (
              <td key={index}>
                {examFinish ? (
                  result
                ) : (
                  <Dropdown
                    overlay={getContextMenu(
                      grades,
                      updateTotalResult(student),
                      isGradeMode
                    )}
                    trigger={['click']}
                  >
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="click">
                        {result}
                        <EditOutlined />
                      </span>
                    </a>
                  </Dropdown>
                )}
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}

export default Totals
