import React, { useState } from 'react'
import { Modal, Input } from 'antd'

const ConfirmModal = ({ hide, checkPhoneNumber }) => {
  const [value, setValue] = useState('')

  return (
    <Modal
      title={`请输入电话号码后四位确认登陆`}
      visible={true}
      onCancel={hide}
      onOk={() => checkPhoneNumber(value)}
    >
      <Input
        addonBefore="电话号码后四位"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={() => checkPhoneNumber(value)}
      />
    </Modal>
  )
}

export default ConfirmModal
