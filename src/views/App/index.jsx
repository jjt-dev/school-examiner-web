import React, { useEffect, useMemo } from 'react'
import { Spin } from 'antd'
import Header from 'src/components/Header'
import { useSelector, useDispatch } from 'react-redux'
import * as appAction from 'src/actions/app'
import Router, { routes } from '../Router'
import './index.less'
import { useHistory, useLocation } from 'react-router'
import ErrorBoundary from 'src/components/ErrorBoundary'
import JjtBreadcrumb from 'src/components/JjtBreadcrumb'
import { matchPath } from 'react-router'
import classnames from 'classnames'
import TableDragSelect from 'src/components/TableDragSelect'

const App = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const { loading, user } = useSelector((state) => state.app)
  const isLoginPage = useMemo(() => location.pathname.startsWith('/login'), [
    location,
  ])

  const activeRoute = useMemo(() => {
    return routes.find(
      (route) =>
        !!matchPath(location.pathname, { path: route.path, exact: true })
    )
  }, [location])

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
    <div className={classnames('app', { 'breadcrumb-active': hasBreadcrumb })}>
      <Header user={user} isLoginPage={isLoginPage} />
      <main>
        <ErrorBoundary>
          <JjtBreadcrumb activeRoute={activeRoute} history={history} />
          {isLoginPage || user ? <Router /> : <div></div>}
        </ErrorBoundary>
      </main>
      {loading && <Spin />}
      {false && <TableDragSelect></TableDragSelect>}
    </div>
  )
}

export default App
