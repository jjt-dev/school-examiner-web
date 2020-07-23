import React from 'react'
import { scoreToGrade, getResultColumns } from '../../helper'
import { getTotalScore } from 'src/utils/common'

/**
 * 因为react-table-drag-select的更新有问题，导致综合统计不会更新，这里用Totals组件覆盖
 *
 * @param {*} param0
 */
const Totals = ({ studentList, examItems, grades, isGradeMode }) => {
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
            const totalScore = getTotalScore(student, examItems, grades)
            return (
              <td key={index}>
                {isGradeMode
                  ? totalScore
                  : scoreToGrade(totalScore, grades).name}
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}

export default Totals
