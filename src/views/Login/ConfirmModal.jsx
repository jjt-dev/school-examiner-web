import React, { useState } from 'react'
import { Modal, Input } from 'antd'

const ConfirmModal = ({ hide, name, checkPhoneNumber }) => {
  const [value, setValue] = useState('')

  return (
    <Modal
      title="输入电话后四位确认登录"
      visible={true}
      onCancel={hide}
      onOk={() => checkPhoneNumber(value)}
    >
      <h3>{`${name}考官您好:`}</h3>
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
