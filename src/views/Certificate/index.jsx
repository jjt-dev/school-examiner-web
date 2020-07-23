import React from 'react'
import './index.less'
import { parseSearches } from 'src/utils/common'
import { CertificateCategory } from './helper'
import ReportPrint from './ReportPrint'
import MakeupExamCertif from './MakeupExamCertif'
import useFetch from 'src/hooks/useFetch'

const Certificate = ({ match, location }) => {
  const { roundNum, studentId } = match.params
  const { type } = parseSearches(location)
  const [examResult] = useFetch(buildPath(roundNum, studentId))

  return (
    <>
      {examResult && (
        <div className="page certificate">
          <div className="certificate__title">
            {CertificateCategory[type].title}打印
          </div>
          {type === 'report' && <ReportPrint examResult={examResult} />}
          {type === 'exam' && (
            <MakeupExamCertif examResult={examResult} roundNum={roundNum} />
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
