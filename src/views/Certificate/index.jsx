import React from 'react'
import './index.less'
import { parseSearches } from 'src/utils/common'
import { CertificateCategory } from './helper'
import ReportPrint from './ReportPrint'
import MakeupExamCertif from './MakeupExamCertif'
import useFetch from 'src/hooks/useFetch'

const Certificate = ({ match, location }) => {
  const { roundNum, studentId } = match.params
  const { type, PassScore } = parseSearches(location)
  const [examResult] = useFetch(buildPath(roundNum, studentId))

  //这里的examResult如果是单个考生的成绩那就是object, 如果是批量打印那就是array
  let examResultArr = []
  if (examResult) {
    if (!Array.isArray(examResult)) {
      examResultArr = [examResult]
    } else {
      examResultArr = examResult
    }
  }

  const examResultPassed = examResultArr.filter(
    (item) => item.examResults[0].isPass
  )
  const examResultFailed = examResultArr.filter(
    (item) => !item.examResults[0].isPass
  )

  return (
    <>
      {examResultArr && (
        <div className="page certificate">
          <div className="certificate__title">
            {CertificateCategory[type].title}打印
          </div>
          {type === 'report' && <ReportPrint examResult={examResultPassed} />}
          {type === 'exam' && (
            <MakeupExamCertif
              examResult={examResultFailed}
              roundNum={roundNum}
              PassScore={PassScore}
            />
          )}
        </div>
      )}
    </>
  )
}

export default Certificate

const buildPath = (roundNum, studentId) => {
  if (studentId) {
    return `/exam/getStudentExamResult?roundNum=${roundNum}&studentId=${studentId}`
  }
  return `/exam/getStudentExamResults?roundNum=${roundNum}`
}
