import { routerMiddleware, connectRouter } from 'connected-react-router'
import { applyMiddleware } from 'redux'
import thunkMiddleware from './middlewares/thunk'
import promiseMiddleware from './middlewares/promise'
import errorMiddleware from './middlewares/error'
import loadingMiddleware from './middlewares/loading'
import app from 'src/reducers/app'
import examRound from 'src/reducers/examRound'

import { createStore } from 'src/utils/injectReducer'

export default (history) => {
  return createStore(
    {
      router: connectRouter(history),
      app,
      examRound,
    },
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware,
      loadingMiddleware,
      promiseMiddleware,
      errorMiddleware
    )
  )
}
