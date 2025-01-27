import React from 'react'
import { Tabs } from 'antd'
import ReportVertical from '../ReportVertical'
import ReportHoriz from '../ReportHoriz'
import ReportVerticalWithRight from '../ReportVerticalWithRight'
import { useSelector, useDispatch } from 'react-redux'
import { updatePrintTabKey } from 'src/actions/app'

const { TabPane } = Tabs

const ReportPrint = ({ examResult }) => {
  const dispatch = useDispatch()
  const { printTabKey } = useSelector((state) => state.app)

  const handleChange = (key) => {
    dispatch(updatePrintTabKey(String(key)))
  }

  return (
    <Tabs defaultActiveKey={printTabKey} onChange={handleChange}>
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
