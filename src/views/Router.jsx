import React from 'react'
import { Switch, Redirect } from 'react-router'
import { Route } from 'react-router-dom'
import Login from './Login'
import ExamRoundList from './ExamRound/ExamRoundList'
import ExamRound from './ExamRound/ExamRound'
import NextGroup from './NextGroup'
import Certificate from './Certificate'
import ResourcePool from './ResourcePool'

export const routes = [
  { path: '/login', comp: Login },
  {
    path: '/exam-rounds',
    comp: ExamRoundList,
  },
  {
    path: '/exam-round/:roundNum',
    comp: ExamRound,
    back: { path: '/exam-rounds', breadcrumbs: ['考试分组列表', '考试详情'] },
  },
  {
    path: '/next-group',
    comp: NextGroup,
  },
  {
    path: '/certificate/:roundNum/:studentId',
    comp: Certificate,
    back: {
      path: '/exam-round/:roundNum',
      params: ['roundNum'],
      breadcrumbs: ['证书打印'],
    },
  },
  {
    path: '/certificate/:roundNum',
    comp: Certificate,
    back: {
      path: '/exam-round/:roundNum',
      params: ['roundNum'],
      breadcrumbs: ['证书打印'],
    },
  },
  {
    path: '/resource-pool',
    comp: ResourcePool,
    back: { path: '/exam-rounds', breadcrumbs: ['考试分组列表', '资源池'] },
  },
]

const Router = () => (
  <Switch>
    {routes.map((route) => {
      const { path, comp } = route
      return <Route key={path} path={path} exact component={comp} />
    })}
    <Redirect
      to={{
        pathname: '/exam-rounds',
      }}
    />
  </Switch>
)

export default Router
