import React from 'react'
import './index.less'
import { Row, Col, Button, Switch } from 'antd'
import { BasicInfoPositions, mapReportValue } from '../helper'
import certificateIc1 from 'src/images/certificate_ic1.png'
import certificateIc2 from 'src/images/certificate_ic2.png'
import { getDomain, chineseDate } from 'src/utils/common'
import api from 'src/utils/api'
import ResultItems from '../ResultItems'
import ReactToPrint from 'react-to-print'
import UplaodImg from 'src/components/UploadImg'
import { ExamResultMode } from 'src/utils/const'

class ReportVerticalWithRight extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      template: {},
      basicInfos: [],
      rightImg: '',
      withBgImg: true,
    }
    this.myRef = React.createRef()
  }

  toggleBgImage = (checkStatus) => {
    this.setState((pre) => ({ ...pre, withBgImg: checkStatus }))
  }

  componentDidMount() {
    const fetchData = async () => {
      const result = await api.get(`/exam/getFileTemplate?type=0`)
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

  setRightImg = (rightImg) => {
    this.setState({ ...this.state, rightImg })
  }

  render() {
    const bgImageLink = this.state.withBgImg
      ? `url(${getDomain()}${this.state.template.bgUrl})`
      : ''

    return (
      <div className="report-vertical-right">
        <div className="report-header">
          <UplaodImg callback={this.setRightImg} btnSize="small" />
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
        <div className="report-vertical-right__content" ref={this.myRef}>
          {this.props.examResultContainer.map((item, index) => {
            // 目前只能报考一个考试，所以直接取results第一个元素
            const { studentInfo, examResults } = item
            const { studentFaceUrl, schoolName } = studentInfo
            const examResult = examResults[0]
            const mappedValue = mapReportValue(studentInfo, examResult)
            return (
              <div key={index} className="report-vertical-right__content-item">
                <div
                  className="report-vertical-right__content-item-report"
                  style={{ backgroundImage: bgImageLink }}
                >
                  <div className="report-vertical-right__content-item-report-edit">
                    <div className="basic-info">
                      <div
                        className="basic-info__logo"
                        style={{
                          backgroundImage: `url(${getDomain()}${studentFaceUrl})`,
                        }}
                      />
                      <div className="basic-info__content">
                        <Row>
                          <Col span={24}>
                            <span className="basic-info__content-school">
                              报考单位
                            </span>
                            <span className="basic-info__content-colon">:</span>
                            <span>{schoolName}</span>
                          </Col>
                          {BasicInfoPositions.map((position) => {
                            const info = this.findInfo(position)
                            return (
                              <Col
                                key={position}
                                span={position % 2 === 1 ? 13 : 11}
                              >
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
                    </div>
                    <div className="result-level">
                      <img src={certificateIc1} alt="" />
                      <span className="result-level__title">
                        {examResult?.scoreMode === ExamResultMode.score
                          ? examResult?.score
                          : examResult?.gradeName}
                      </span>
                      <img src={certificateIc2} alt="" />
                    </div>
                    <div className="item-result">
                      <div className="item-result__title">综合成绩</div>
                      <ResultItems resultItems={examResult?.items} />
                      <div className="item-result__comments">
                        <div className="item-result__comments-item writing-mode-vertical">
                          考官评语
                        </div>
                        <div className="item-result__comments-item examiner-comment">
                          {examResult?.comment}
                          <div className="examiner-comment__sign">
                            【考官】:
                            <div className="examiner-comment__sign-name">
                              {examResult.examinerName}
                            </div>
                          </div>
                        </div>
                        <div className="item-result__comments-item writing-mode-vertical">
                          备注
                        </div>
                        <div className="item-result__comments-item examiner-remark">
                          <div>1.考官未打分的科目属于本级别规定不考科目</div>
                          <div>2.考试合格的学员凭此表领取证书和腰带</div>
                          <div>
                            3.考试不合格的学员凭补考单进行补考 (限补考一次)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="report-vertical-right__content-item-report-edit-date">
                      日期: {chineseDate()}
                    </div>
                  </div>
                </div>
                <div
                  className="report-vertical-right__content-item-custom"
                  style={{
                    backgroundImage: `url(${getDomain()}${this.state.rightImg}`,
                  }}
                ></div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ReportVerticalWithRight
