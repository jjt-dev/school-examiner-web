import React from 'react'
import './index.less'
import { Row, Col, Button, Switch } from 'antd'
import { BasicInfoPositions, mapReportValue } from '../helper'
import api from 'src/utils/api'
import { getDomain, chineseDate } from 'src/utils/common'
import ReactToPrint from 'react-to-print'
import ResultItems from '../ResultItems'
import { ExamResultMode } from 'src/utils/const'

class ReportHoriz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      template: {},
      basicInfos: [],
      withBgImg: true,
    }
    this.myRef = React.createRef()
  }

  toggleBgImage = (checkStatus) => {
    this.setState((pre) => ({ ...pre, withBgImg: checkStatus }))
  }

  componentDidMount() {
    const fetchData = async () => {
      const result = await api.get(`/exam/getFileTemplate?type=1`)
      this.setState({
        ...this.state,
        template: result,
        basicInfos: JSON.parse(result.content).basicInfos,
      })
    }
    fetchData()
  }

  findInfo = (position) => {
    return this.state.basicInfos.find((info) => info.position === position)
  }

  render() {
    const printMap = {
      1: 799.2,
      2: 799.2,
      3: 799.1,
      4: 799.1,
      5: 799.1,
      6: 799.08,
      7: 799.06,
      8: 799.06,
      9: 799.06,
      10: 799.06,
    }

    const bgImageLink = this.state.withBgImg
      ? `url(${getDomain()}${this.state.template.bgUrl})`
      : ''

    return (
      <div className="report-horiz">
        <div className="report-header">
          <ReactToPrint
            trigger={() => <Button size="small">打印</Button>}
            content={() => this.myRef.current}
          />
          <Switch
            onChange={this.toggleBgImage}
            checkedChildren="显示背景"
            unCheckedChildren="隐藏背景"
            defaultChecked
          />
        </div>
        <div className="report-horiz__content" ref={this.myRef}>
          {this.props.examResultContainer.map((item, index) => {
            // 目前只能报考一个考试，所以直接取results第一个元素
            const { studentInfo, examResults } = item
            const { studentFaceUrl, schoolName } = studentInfo
            const examResult = examResults[0]
            const mappedValue = mapReportValue(studentInfo, examResult)
            console.log('mappedValue', mappedValue)
            return (
              <div
                key={index}
                className="report-horiz__content-report"
                style={{
                  backgroundImage: bgImageLink,
                  height: `${
                    printMap[this.props.examResultContainer.length] ?? 799.06
                  }px`,
                }}
              >
                <div className="report-horiz__content-report-edit">
                  <div className="basic-info">
                    <div
                      className="basic-info__logo"
                      style={{
                        backgroundImage: `url(${getDomain()}${studentFaceUrl})`,
                      }}
                    />
                    <div className="basic-info__content">
                      <Row>
                        <Col span={24} className="ant-dropdown-link">
                          <span className="basic-info__content-school">
                            报考单位
                          </span>
                          <span className="basic-info__content-colon">:</span>
                          <span>{schoolName}</span>
                        </Col>
                        {BasicInfoPositions.map((position) => {
                          const info = this.findInfo(position)
                          return (
                            <Col key={position} span={12}>
                              {info ? (
                                <>
                                  <span className="basic-info__content-title">
                                    {info.name}
                                  </span>
                                  <span className="basic-info__content-colon">
                                    :
                                  </span>
                                  <span>{mappedValue[info.name]}</span>
                                </>
                              ) : (
                                <></>
                              )}
                            </Col>
                          )
                        })}
                      </Row>
                    </div>
                    <div className="basic-info__result-level">
                      <span className="result-level__grade">
                        {examResult?.scoreMode === ExamResultMode.score
                          ? examResult?.score
                          : examResult?.gradeName}
                      </span>
                      <span className="result-level__title">综合成绩</span>
                    </div>
                  </div>
                  <div className="results">
                    <div>日期: {chineseDate()}</div>
                    <div className="results__middle">
                      <ResultItems resultItems={examResult?.items} />
                      <div className="results__middle-comments">
                        <div className="results__middle-comments-item">
                          考官评语
                        </div>
                        {examResult?.comment}
                        <div className="examiner-comment__sign">
                          【考官】:
                          <div className="examiner-comment__sign-name">
                            {examResult.examinerName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="results__remark">
                      <div className="results__remark-title">备注:</div>
                      <div className="results__remark-content">
                        <div>
                          1.考官未打分的科目属于本级别规定不考科目;
                          2.考试合格的学员凭此表领取证书和腰带
                        </div>
                        <div>
                          3.考试不合格的学员凭补考单进行补考 (限补考一次);
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ReportHoriz
