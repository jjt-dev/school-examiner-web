import { addNumPrefix, formatTime } from 'src/utils/common'

export const CertificateTypes = {
  0: { id: 0, key: 'reportVertical', title: '考试成绩单(竖版)' },
  1: { id: 1, key: 'reportHoriz', title: '考试成绩单(横板)' },
  2: { id: 2, key: 'examCertificate', title: '准考证' },
}

export const CertificateCategory = {
  report: { title: '考试成绩单' },
  exam: { title: '补考证' },
}

export const BasicInfoPositions = [1, 2, 3, 4, 5, 6, 7, 8]

export const ReportBasicInfos = [
  '考号',
  '姓名',
  '性别',
  '出生时间',
  '身份证号',
  '当前级别',
  '报考级别',
  '申请带色',
]
export const ExamBasicInfos = [
  '姓名',
  '性别',
  '出生时间',
  '报考级别',
  '申请带色',
  '指导教练',
  '考试时间',
  '考试地点',
]

export const Genders = {
  0: ' 女',
  1: '男',
}

export const mapReportValue = (student, examResult = {}) => {
  const {
    studentName,
    studentGender,
    studentBirthday,
    studentCardId,
    signLevelName,
  } = student
  const { roundNum, subOrderNum, levelName, levelAlias } = examResult
  // 补考场次是负数，这里如果是补考加1000显示正数来区分
  const finalRoundNum = roundNum > 0 ? roundNum : roundNum + 1000
  return {
    考号: `${finalRoundNum}-${addNumPrefix(subOrderNum)}`,
    姓名: studentName,
    性别: Genders[studentGender],
    出生时间: formatTime(studentBirthday),
    身份证号: studentCardId,
    当前级别: signLevelName,
    报考级别: levelName,
    申请带色: levelAlias,
  }
}

export const mapExamCertifValue = ({
  schoolInfo = {},
  signLevel = {},
  studentInfo = {},
}) => {
  return {
    schoolName: schoolInfo.name,
    schoolSite: schoolInfo.website,
    姓名: studentInfo.studentName,
    性别: Genders[studentInfo.studentGender],
    出生时间: formatTime(studentInfo.studentBirthday),
    报考级别: signLevel.levelName,
    申请带色: signLevel.levelAlias,
    指导教练: studentInfo.coach,
    考试时间: formatTime(studentInfo.examStartTime),
    考试地点: studentInfo.examAddress,
    cardId: studentInfo.studentCardId,
  }
}

/**
 * 在打印成绩单的时候，基本信息模块，如果某一个信息紧挨着的上面的信息缺失，则把该信息位置挪上去
 *
 * @param {*} basicInfos
 */
export const reorderBasicInfos = (basicInfos) => {
  const sameColumnDistance = 2
  basicInfos.forEach((info) => {
    const preColumnPos = info.position - sameColumnDistance
    if (info.position <= sameColumnDistance) return
    if (basicInfos.every((item) => item.position === preColumnPos)) return
    info.position = preColumnPos
  })
  return basicInfos
}
