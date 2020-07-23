import React from 'react'
import { Button } from 'antd'
import './index.less'
import { useHistory } from 'react-router'

const BackBtn = ({ back }) => {
  const history = useHistory()

  return (
    <Button
      className="back-btn"
      type="primary"
      onClick={() => history.push(back)}
    >
      返回
    </Button>
  )
}

export default BackBtn
