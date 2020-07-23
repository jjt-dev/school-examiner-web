import { isFSA } from 'flux-standard-action'

function isPromise(val) {
  return val && typeof val.then === 'function'
}

export default function promiseMiddleware({ dispatch, getState }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action)
    }

    const promise = action.payload
    if (!isPromise(promise)) return next(action)

    const handlers = action.meta ? action.meta.handlers : null

    return promise
      .then(res => {
        next({ ...action, payload: res })
        if (handlers) {
          handlers.handleSuccess &&
            handlers.handleSuccess(dispatch, getState, res)
          handlers.handlefinally && handlers.handlefinally(dispatch, getState)
        }
      })
      .catch(err => {
        next({ ...action, payload: err, error: true })
        if (handlers) {
          handlers.handleError && handlers.handleError(dispatch, getState, err)
          handlers.handlefinally && handlers.handlefinally(dispatch, getState)
        }
      })
  }
}
