import React from 'react'
import { Tabs } from 'antd'
import ReportVertical from '../ReportVertical'
import ReportHoriz from '../ReportHoriz'
import ReportVerticalWithRight from '../ReportVerticalWithRight'

const { TabPane } = Tabs

const ReportPrint = ({ examResult }) => {
  //这里的examResult如果是单个考生的成绩那就是object, 如果是批量打印那就是array
  let examResultArr = examResult
  if (!Array.isArray(examResult)) {
    examResultArr = [examResult]
  }

  return (
    <Tabs defaultActiveKey="0" onChange={() => {}}>
      <TabPane tab="竖版" key="0">
        <ReportVertical examResultContainer={examResultArr} />
      </TabPane>
      <TabPane tab="竖版(自定义右半边)" key="1">
        <ReportVerticalWithRight examResultContainer={examResultArr} />
      </TabPane>
      <TabPane tab="横板" key="2">
        <ReportHoriz examResultContainer={examResultArr} />
      </TabPane>
    </Tabs>
  )
}

export default ReportPrint
