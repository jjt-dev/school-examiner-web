import React from 'react'
import {
  InfoCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

/**
 * 分页默认配置
 */
export const pagConfig = JSON.parse(
  JSON.stringify({
    size: 'small',
    showLessItems: true,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  })
)

export const ExamStates = {
  0: '等待报名',
  10: '报名中',
  20: '等待考试',
  30: '考试中',
  40: '完成',
}

export const EntityStatus = {
  CREATE: '新增',
  EDIT: '编辑',
}

export const Genders = {
  0: ' 女',
  1: '男',
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

export const timeFormat = 'YYYY-MM-DD HH:mm'
export const dateFormat = 'YYYY-MM-DD'

export const RoundStatus = {
  uninitiated: {
    id: 0,
    key: 'uninitiated',
    title: '考试未开始',
    icon: <InfoCircleOutlined />,
  },
  ongoing: {
    id: 10,
    key: 'ongoing',
    title: '考试进行中',
    icon: <ClockCircleOutlined />,
  },
  pause: {
    id: 11,
    key: 'pause',
    title: '考试暂停',
    icon: <PauseCircleOutlined />,
  },
  finish: {
    id: 20,
    key: 'finish',
    title: '考试结束',
    icon: <CheckCircleOutlined />,
  },
}

export const StudentExamStatus = [
  { isEnable: 'true', title: '考试中' },
  { isEnable: 'false', title: '请假' },
]

export const CertificateCategory = {
  report: { key: 'report', title: '考试成绩单' },
  exam: { key: 'exam', title: '补考单' },
}

export const ExamResultMode = {
  score: 0,
  grade: 1,
}

export const ResourcePoolStatus = {
  waitForGroup: { id: 0, title: '已经创建，等待分组' },
  grouped: { id: 1, title: '已经被分组' },
  pass: { id: 2, title: '通过考试' },
  failed: { id: 3, title: '未通过考试' },
  absence: { id: 4, title: '缺考' },
}

export const ResourcePoolSource = {
  signAfterExamStart: { id: 0, title: '临时报名' },
  lateArrive: { id: 1, title: '迟到' },
  failed: { id: 2, title: '正常考试未通过' },
  makeupFailed: { id: 3, title: '补考考试未通过' },
}

export const examRoundBroadcast = new BroadcastChannel('examRound')

export const gradeColorMap = {
  unqualified: 'var(--grade-unqualified)',
  qualified: 'var(--grade-qualified)',
  medium: 'var(--grade-medium)',
  good: 'var(--grade-good)',
  excellent: 'var(--grade-excellent)',
  supreme: 'var(--grade-supreme)',
}
