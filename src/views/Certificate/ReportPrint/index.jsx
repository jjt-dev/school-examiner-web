import React from 'react'
import { Tabs } from 'antd'
import ReportVertical from '../ReportVertical'
import ReportHoriz from '../ReportHoriz'
import ReportVerticalWithRight from '../ReportVerticalWithRight'

const { TabPane } = Tabs

const ReportPrint = ({ examResult }) => {
  return (
    <Tabs defaultActiveKey="0" onChange={() => {}}>
      <TabPane tab="竖版" key="0">
        <ReportVertical examResultContainer={examResult} />
      </TabPane>
      <TabPane tab="竖版(自定义右半边)" key="1">
        <ReportVerticalWithRight examResultContainer={examResult} />
      </TabPane>
      <TabPane tab="横板" key="2">
        <ReportHoriz examResultContainer={examResult} />
      </TabPane>
    </Tabs>
  )
}

export default ReportPrint
