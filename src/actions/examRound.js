import { createAction } from 'redux-actions'
import api from 'src/utils/api'

export const GET_EXAM_ROUND = 'GET_EXAM_ROUND'

export const UPDATE_STUDENT = 'UPDATE_STUDENT'
export const UPDATE_RESULT = 'UPDATE_RESULT'
export const UPDATE_RESULT_BATCH = 'UPDATE_RESULT_BATCH'
export const UPDATE_EXAM_STATUS = 'UPDATE_EXAM_STATUS'

export const CLEAR_EXAM_RESULT = 'CLEAR_EXAM_RESULT'

export const START_EXAM = 'START_EXAM'
export const PAUSE_EXAM = 'PAUSE_EXAM'
export const RESUME_EXAM = 'RESUME_EXAM'
export const FINISH_EXAM = 'FINISH_EXAM'
export const CLEAR_EXAM = 'CLEAR_EXAM'

export const getExamRound = createAction(GET_EXAM_ROUND, (roundNum) =>
  api.get(`/exam/examDetail?roundNum=${roundNum}`)
)

export const updateStudent = createAction(
  UPDATE_STUDENT,
  (studentId, field, value) => ({ studentId, field, value })
)

export const updateResult = createAction(
  UPDATE_RESULT,
  (student, itemId, value) => ({ student, itemId, value })
)

export const updateResultBatch = createAction(
  UPDATE_RESULT_BATCH,
  (params) => params
)

export const updateExamStatus = createAction(
  UPDATE_EXAM_STATUS,
  (params) => params
)

export const clearExamResult = createAction(
  CLEAR_EXAM_RESULT,
  (params) => params
)

export const startExam = createAction(START_EXAM, (roundNum) =>
  api.post(`/exam/startExam?roundNum=${roundNum}`)
)

export const pauseExam = createAction(PAUSE_EXAM, (payload) =>
  api.post(`/exam/pauseExam`, payload)
)

export const resumeExam = createAction(RESUME_EXAM, (executeId) =>
  api.post(`/exam/resumeExam?executeId=${executeId}`)
)

export const finishExam = createAction(FINISH_EXAM, (params) => params)

export const clearExam = createAction(CLEAR_EXAM)
