import { handleActions } from 'redux-actions'
import set from 'lodash/fp/set'
import flow from 'lodash/fp/flow'
import {
  GET_EXAM_ROUND,
  UPDATE_STUDENT,
  UPDATE_RESULT,
  UPDATE_TOTAL_RESULT,
  UPDATE_RESULT_BATCH,
  START_EXAM,
  PAUSE_EXAM,
  RESUME_EXAM,
  FINISH_EXAM,
  CLEAR_EXAM_RESULT,
  CLEAR_EXAM,
} from 'src/actions/examRound'
import { deepClone, getTotalScore, gradeToScore } from 'src/utils/common'
import { RoundStatus } from 'src/utils/const'
import { message } from 'antd'
import { goToLogin } from 'src/utils/api'

const initState = {
  examRound: null,
  absentStudents: [],
}

const examRound = handleActions(
  {
    [GET_EXAM_ROUND]: (state, { payload }) => {
      payload.studentList = initStudentResults(payload)
      return {
        ...state,
        examRound: payload,
      }
    },
    [UPDATE_STUDENT]: (state, { payload }) => {
      const { studentList } = state.examRound
      const { studentId, field, value } = payload
      const index = studentList.findIndex(
        (stud) => stud.studentId === studentId
      )
      return set(`examRound.studentList[${index}][${field}]`, value, state)
    },
    [UPDATE_RESULT]: (state, { payload }) => {
      const { studentList, examItems } = state.examRound
      const { student, itemId, value } = payload
      const { studentId, levelId } = student
      const index = studentList.findIndex(
        (stud) => stud.studentId === studentId && stud.levelId === levelId
      )
      const { results = {}, updatedItems = {} } = studentList[index]
      results[itemId] = value
      updatedItems[itemId] = true
      return flow(
        set(`examRound.studentList[${index}].results`, results),
        set(`examRound.studentList[${index}].updatedItems`, updatedItems),
        set(
          `examRound.studentList[${index}].totalScore`,
          getTotalScore(student, examItems)
        )
      )(state)
    },
    [UPDATE_TOTAL_RESULT]: (state, { payload }) => {
      const { studentList } = state.examRound
      const { student, value } = payload
      const { studentId, levelId } = student
      const index = studentList.findIndex(
        (stud) => stud.studentId === studentId && stud.levelId === levelId
      )
      return set(`examRound.studentList[${index}].totalScore`, value, state)
    },
    [UPDATE_RESULT_BATCH]: (state, { payload }) => {
      const { examItems } = state.examRound
      const studentList = deepClone(state.examRound.studentList)
      payload.forEach((item) => {
        const { studentIndex, itemIndex, score } = item
        const { results = {}, updatedItems = {} } = studentList[studentIndex]
        const itemId = examItems[itemIndex].id
        results[itemId] = score
        updatedItems[itemId] = true
        studentList[studentIndex].results = results
        studentList[studentIndex].updatedItems = updatedItems
      })
      return set(`examRound.studentList`, studentList, state)
    },
    [START_EXAM]: (state, { payload }) => {
      return flow(
        set('examRound.headerInfo.examState', RoundStatus.ongoing.id),
        set('examRound.executionInfo.executionId', payload.id)
      )(state)
    },
    [PAUSE_EXAM]: (state) => {
      return set(`examRound.headerInfo.examState`, RoundStatus.pause.id, state)
    },
    [RESUME_EXAM]: (state) => {
      return set(
        `examRound.headerInfo.examState`,
        RoundStatus.ongoing.id,
        state
      )
    },
    [FINISH_EXAM]: (state) => {
      return set(`examRound.headerInfo.examState`, RoundStatus.finish.id, state)
    },
    [CLEAR_EXAM]: (state) => {
      return set(`examRound`, null, state)
    },
    [CLEAR_EXAM_RESULT]: (state) => {
      const newStudentList = state.examRound.studentList.map((student) => {
        student.results = {}
        return student
      })

      return set(`examRound.studentList`, newStudentList, state)
    },
  },
  initState
)

export default examRound

const initStudentResults = (examRound) => {
  let { studentList, examItems, grades, examResult } = examRound
  const goodGrade = grades.find((grade) => grade.name === '良好')
  if (!goodGrade) {
    message.error('学科考试等级需要配置默认的良好')
    goToLogin()
    return
  }
  studentList = studentList.map((student) => {
    let results = {}
    if (examResult) {
      examResult
        .filter(
          (result) =>
            result.studentId === student.studentId && !result.isStatisticalValue
        )
        .forEach((result) => {
          results[result.examItemId] = result.score
        })

      const statsValue = examResult.find(
        (result) =>
          result.studentId === student.studentId && result.isStatisticalValue
      )
      student.isEnable = statsValue.isEnable.toString()
    } else {
      //如果考试没有结束就默认给考试每一项设置'良好'的成绩
      examItems.forEach((item) => {
        results[item.id] = gradeToScore(goodGrade.id, grades)
      })
    }
    student.results = results

    return student
  })
  return studentList
}
