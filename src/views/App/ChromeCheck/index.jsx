import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { getDomain, isProdEnv } from 'src/utils/common'
import './index.less'

const ChromeCheck = () => {
  const isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
  const [visible, setVisible] = useState(!isChrome && isProdEnv)

  const downloadExamineeInfo = () => {
    window.open(`${getDomain()}/images/jjt/config/ChromeSetup.exe`, '_blank')
  }

  return (
    <Modal
      title="请下载chrome浏览器获得更好的使用体验"
      wrapClassName="chrome-check"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          取消
        </Button>,
      ]}
    >
      <Button type="primary" onClick={downloadExamineeInfo}>
        点击下载
      </Button>
    </Modal>
  )
}

export default ChromeCheck
