import React, { useState } from 'react'
import './index.less'
import api from 'src/utils/api'
import { local, EXAMINER_TOKEN, EXAM_CODE, session } from 'src/utils/storage'
import * as appAction from 'src/actions/app'
import { useDispatch, useSelector } from 'react-redux'
import { parseSearches } from 'src/utils/common'
import useDidMount from 'src/hooks/useDidMount'
import JjtAvatar from 'src/components/JjtAvatar'
import { message, Empty } from 'antd'
import ConfirmModal from './ConfirmModal'

const Login = ({ history, location }) => {
  const dispatch = useDispatch()
  const [selectedExaminer, setSelectedExaminer] = useState()
  const { examinerList } = useSelector((state) => state.app)
  const hasExaminer = examinerList.length > 0

  /**
   * 从用户输入的url中拿到examCode
   */
  useDidMount(() => {
    const { examCode } = parseSearches(location)
    if (examCode) {
      session.setItem(EXAM_CODE, examCode)
    }
    if (session.getItem(EXAM_CODE)) {
      dispatch(appAction.getExaminerList(session.getItem(EXAM_CODE)))
    } else {
      message.error('无效的考试码')
    }
  })

  const checkPhoneNumber = (value) => {
    if (selectedExaminer.phone.endsWith(value)) {
      selectExaminer()
    } else {
      message.error('输入的电话号码后四位不正确')
    }
  }

  const selectExaminer = async () => {
    const { username } = selectedExaminer
    try {
      const result = await api.post(
        `/common/login?username=${username}&examCode=${session.getItem(
          EXAM_CODE
        )}`
      )
      local.setItem(EXAMINER_TOKEN, result)
      dispatch(appAction.getUserInfo())
      history.push('/')
    } catch (e) {
      console.log(e)
    }
  }

  const title = hasExaminer
    ? '请选择账号登录进入考试'
    : '未设置考官，请联系道馆管理员'

  return (
    <div className="page examiner-list">
      <div className="page examiner-list__title">{title}</div>
      {hasExaminer ? (
        <div className="page examiner-list__content">
          {examinerList.map((item) => (
            <div
              key={item.id}
              className="examiner-list__content-grid"
              onClick={() => setSelectedExaminer(item)}
            >
              <JjtAvatar imageUrl={item.faceUrl} disabled={true} />
              <div className="examiner-list__content-grid-info">
                <div>姓名: {item.username}</div>
                <div>电话: {item.phone}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty className="examiner-list__empty"></Empty>
      )}
      {selectedExaminer && (
        <ConfirmModal
          hide={() => setSelectedExaminer(false)}
          checkPhoneNumber={checkPhoneNumber}
          name={selectedExaminer.username}
        />
      )}
    </div>
  )
}

export default Login
