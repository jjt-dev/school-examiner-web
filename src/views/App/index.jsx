import './index.less'

import { Spin } from 'antd'
import classnames from 'classnames'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import * as appAction from 'src/actions/app'
import ErrorBoundary from 'src/components/ErrorBoundary'
import JjtBreadcrumb from 'src/components/JjtBreadcrumb'
import useActiveRoute from 'src/hooks/useActiveRoute'
import Header from 'src/views/App/Header'

import Router from '../Router'
import ChromeCheck from './ChromeCheck'

const App = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { loading, user } = useSelector((state) => state.app)
  const activeRoute = useActiveRoute()
  const { isLoginPage, isNextGroup } = activeRoute

  const hasBreadcrumb = activeRoute && activeRoute.back

  useEffect(() => {
    if (!isLoginPage) {
      dispatch(appAction.getUserInfo())
    }
  }, [dispatch, isLoginPage])

  useEffect(() => {
    if (user) {
      dispatch(appAction.getExamInfo())
    }
  }, [dispatch, user])

  return (
    <div
      className={classnames('app', {
        'breadcrumb-active': hasBreadcrumb,
        'next-group-active': isNextGroup,
      })}
    >
      <Header user={user} isLoginPage={isLoginPage} />
      <main>
        <ErrorBoundary>
          <JjtBreadcrumb activeRoute={activeRoute} history={history} />
          {isLoginPage || user ? <Router /> : <div></div>}
        </ErrorBoundary>
      </main>
      {loading && <Spin />}
      <ChromeCheck />
    </div>
  )
}

export default App
