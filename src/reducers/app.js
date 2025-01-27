import { handleActions } from 'redux-actions'

import {
  APP_SHOW_LOADING,
  APP_CLOSE_LOADING,
  APP_OAUTH_USER,
  GET_EXAM_INFO,
  GET_EXAMINER_LIST,
  GET_EXAM_ROUND_LIST,
  GET_EXAM_MAKEUP_ROUND_LIST,
  UPDATE_PRINT_TAB_KEY,
  GET_ALL_ROUNDS,
} from 'src/actions/app'

const initState = {
  loading: false,
  examinerList: [],
  user: null,
  examInfo: null,
  examRoundList: [],
  examMakeupRoundList: [],
  printTabKey: '0',
}

const app = handleActions(
  {
    [APP_SHOW_LOADING]: (state) => {
      return {
        ...state,
        loading: true,
      }
    },
    [APP_CLOSE_LOADING]: (state) => {
      return {
        ...state,
        loading: false,
      }
    },
    [GET_EXAMINER_LIST]: (state, { payload }) => {
      return {
        ...state,
        examinerList: payload,
      }
    },
    [APP_OAUTH_USER]: (state, { payload }) => {
      return {
        ...state,
        user: payload,
      }
    },
    [GET_EXAM_INFO]: (state, { payload }) => {
      return {
        ...state,
        examInfo: payload,
      }
    },
    [GET_ALL_ROUNDS]: (state, { payload }) => {
      return {
        ...state,
        examRoundList: reorderRound(payload.rounds),
        examMakeupRoundList: reorderRound(payload.makeupRounds),
      }
    },
    [GET_EXAM_ROUND_LIST]: (state, { payload }) => {
      return {
        ...state,
        examRoundList: reorderRound(payload),
      }
    },
    [GET_EXAM_MAKEUP_ROUND_LIST]: (state, { payload }) => {
      return {
        ...state,
        examMakeupRoundList: reorderRound(payload),
      }
    },
    [UPDATE_PRINT_TAB_KEY]: (state, { payload }) => {
      return {
        ...state,
        printTabKey: payload,
      }
    },
  },
  initState
)

export default app

/**
 * round需要根据roundNumOrder来排序,
 *
 * @param {*} roundList
 */
const reorderRound = (roundList) => {
  return roundList
    .sort((a, b) => a.roundNumOrder - b.roundNumOrder)
    .map((item, index) => {
      item.roundNumOrder = index + 1
      return item
    })
}
