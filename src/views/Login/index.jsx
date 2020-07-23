import React from 'react'
import './index.less'
import api from 'src/utils/api'
import { local, EXAMNIER_TOKEN, EXAM_CODE, session } from 'src/utils/storage'
import * as appAction from 'src/actions/app'
import { useDispatch, useSelector } from 'react-redux'
import { parseSearches } from 'src/utils/common'
import useDidMount from 'src/hooks/useDidMount'
import JjtAvatar from 'src/components/JjtAvatar'
import { message, Empty } from 'antd'

const Login = ({ history, location }) => {
  const dispatch = useDispatch()
  const { examinerList } = useSelector((state) => state.app)

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

  const selectExaminer = async (examiner) => {
    const { username } = examiner
    try {
      const result = await api.post(
        `/common/login?username=${username}&examCode=${session.getItem(
          EXAM_CODE
        )}`
      )
      local.setItem(EXAMNIER_TOKEN, result)
      dispatch(appAction.getUserInfo())
      history.push('/')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="page examiner-list">
      <div className="page examiner-list__title">请选择账号登录进入考试</div>
      {examinerList ? (
        <div className="page examiner-list__content">
          {examinerList.map((item) => (
            <div
              key={item.id}
              className="examiner-list__content-grid"
              onClick={() => selectExaminer(item)}
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
    </div>
  )
}

export default Login
