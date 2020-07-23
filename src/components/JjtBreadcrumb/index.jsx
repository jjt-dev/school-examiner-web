import React from 'react'
import { Breadcrumb, Button } from 'antd'
import './index.less'
import { useRouteMatch } from 'react-router'

const JjtBreadcrumb = ({ history, activeRoute }) => {
  const match = useRouteMatch({
    path: activeRoute?.path,
    strict: true,
    sensitive: true,
  })

  if (!activeRoute?.back) return null

  const buildReturnUrl = () => {
    const { back } = activeRoute
    let backUrl = back.path
    if (back.params) {
      back.params.forEach((param) => {
        backUrl = backUrl.replace(`:${param}`, match.params[param])
      })
    }
    return backUrl
  }

  return (
    <div className="jjt__breadcrumb">
      <Breadcrumb separator=">">
        {activeRoute.back.breadcrumbs.map((item) => (
          <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Button
        type="primary"
        size="small"
        onClick={() => history.push(buildReturnUrl())}
      >
        返回
      </Button>
    </div>
  )
}

export default JjtBreadcrumb
