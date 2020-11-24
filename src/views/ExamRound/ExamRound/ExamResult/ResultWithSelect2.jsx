import React from 'react'
import TableDragSelect from 'react-table-drag-select'
import { Avatar, Select } from 'antd'
import { getDomain, gradeToScore, getTooltipByLen } from 'src/utils/common'
import { StudentExamStatus } from 'src/utils/const'
import { scoreToGrade, getResultColumns } from '../../helper'
import './index.less'
import GradeEdit from './GradeEdit'

const ResultWithSelect2 = ({
  examRound,
  updateStudent,
  updateResult,
  isGradeMode,
  cells,
  setCells,
  examFinish,
  getItemColor,
}) => {
  const { studentList, examItems, grades } = examRound
  const resultColumns = getResultColumns(studentList)

  return (
    <div className="exam-round__result">
      <TableDragSelect value={cells} onChange={(cells) => setCells(cells)}>
        <tr className="first-row">
          <td disabled>参数指标</td>
          {resultColumns.map((index) => {
            const student = studentList[index]
            if (!student) return <td key={index} disabled />
            return (
              <td key={index} disabled>
                <Avatar size="large" src={`${getDomain()}${student.faceUrl}`} />
                {getTooltipByLen(student.studentName, 8)}
              </td>
            )
          })}
        </tr>
        <tr className="second-row">
          <td disabled>状态</td>
          {resultColumns.map((index) => {
            const student = studentList[index]
            if (!student) return <td key={index} disabled />
            return (
              <td key={index} disabled>
                <Select
                  disabled={examFinish}
                  onMouseEnter={(e) => e.stopPropagation()}
                  style={{ width: '100px' }}
                  defaultValue={student.isEnable === 'false' ? 'false' : 'true'}
                  onChange={(value) =>
                    updateStudent(student.studentId, 'isEnable', value)
                  }
                >
                  {StudentExamStatus.map((status) => (
                    <Select.Option
                      key={status.isEnable}
                      value={status.isEnable}
                    >
                      {status.title}
                    </Select.Option>
                  ))}
                </Select>
              </td>
            )
          })}
        </tr>
        {examItems.map((item) => (
          <tr key={item.id}>
            <td disabled>{item.name}</td>
            {resultColumns.map((index) => {
              const student = studentList[index]
              const hasThisItem = student.examItems.some(
                (studItem) => studItem.id === item.id
              )
              if (!student || student.isEnable === 'false' || !hasThisItem) {
                return <td key={index} disabled />
              }
              const { results = {}, updatedItems = {} } = student
              const result = results[item.id]
              const itemColor = getItemColor(updatedItems[item.id], result)
              return (
                <td key={index}>
                  <div
                    className="select-container"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {isGradeMode ? (
                      <GradeEdit
                        itemColor={itemColor}
                        examFinish={examFinish}
                        defaultValue={result}
                        changeScore={(score) =>
                          updateResult(student, item.id, score)
                        }
                        grades={grades}
                      />
                    ) : (
                      <Select
                        disabled={examFinish}
                        style={{
                          width: '100px',
                          fontSize: itemColor ? '18px' : '14px',
                        }}
                        className={`grade-${itemColor}`}
                        defaultValue={scoreToGrade(result, grades).id}
                        onSelect={(gradeId) =>
                          updateResult(
                            student,
                            item.id,
                            gradeToScore(gradeId, grades)
                          )
                        }
                      >
                        {grades.map((grade) => (
                          <Select.Option key={grade.id} value={grade.id}>
                            {grade.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </td>
              )
            })}
          </tr>
        ))}
      </TableDragSelect>
    </div>
  )
}

export default ResultWithSelect2
