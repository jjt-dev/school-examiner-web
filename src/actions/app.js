import { createAction } from 'redux-actions'
import api from 'src/utils/api'

export const APP_SHOW_LOADING = 'APP_SHOW_LOADING'
export const APP_CLOSE_LOADING = 'APP_CLOSE_LOADING'

export const APP_OAUTH_USER = 'APP_OAUTH_USER'

export const GET_EXAM_INFO = 'GET_EXAM_INFO'
export const GET_EXAMINER_LIST = 'GET_EXAMINER_LIST'
export const GET_ALL_ROUNDS = 'GET_ALL_ROUNDS'
export const GET_EXAM_ROUND_LIST = 'GET_EXAM_ROUND_LIST'
export const GET_EXAM_MAKEUP_ROUND_LIST = 'GET_EXAM_MAKEUP_ROUND_LIST'

export const UPDATE_PRINT_TAB_KEY = 'UPDATE_PRINT_TAB_KEY'

// 显示/隐藏顶层loading bar
export const showLoadingBar = createAction(APP_SHOW_LOADING)

export const closeLoadingBar = createAction(APP_CLOSE_LOADING)

export const getUserInfo = createAction(APP_OAUTH_USER, () =>
  api.get(`/user/userInfo`)
)

export const getExamInfo = createAction(GET_EXAM_INFO, () =>
  api.get(`/exam/examInfo`)
)

export const getExaminerList = createAction(GET_EXAMINER_LIST, (examCode) =>
  api.get(`/common/examiners?examCode=${examCode}`)
)

export const getAllRounds = createAction(GET_ALL_ROUNDS, async () => {
  const rounds = await api.get(`/exam/roundList`)
  const makeupRounds = await api.get(`/exam/makeupRoundList`)
  return {
    rounds,
    makeupRounds,
  }
})

export const getExamRoundList = createAction(GET_EXAM_ROUND_LIST, () =>
  api.get(`/exam/roundList`)
)

export const getExamMakeupRoundList = createAction(
  GET_EXAM_MAKEUP_ROUND_LIST,
  () => api.get(`/exam/makeupRoundList`)
)

export const updatePrintTabKey = createAction(
  UPDATE_PRINT_TAB_KEY,
  (key) => key
)
