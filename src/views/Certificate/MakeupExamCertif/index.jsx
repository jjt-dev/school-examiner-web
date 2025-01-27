import React from 'react'
import './index.less'
import { Button } from 'antd'
import ReactToPrint from 'react-to-print'
import { addNumPrefix } from 'src/utils/common'
import { useState } from 'react'
import { CheckOutlined } from '@ant-design/icons'

class MakeupExamCertif extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  render() {
    const { roundNum, examResult = [], PassScore } = this.props
    return (
      <div className="makeup-exam-print">
        <div className="makeup-exam-print__header">
          <ReactToPrint
            trigger={() => <Button>打印</Button>}
            content={() => this.myRef.current}
          />
        </div>
        {examResult.map((item) => {
          const [year, month, day] = getDate()
          const { studentInfo, examResults } = item
          const { items, levelName, examinerName, isEnable } = examResults[0]
          return (
            <div className="makeup-exam-print__content" ref={this.myRef}>
              <div className="round-number">
                {addNumPrefix(Math.abs(roundNum))}
              </div>
              <div className="current-year">{year}</div>
              <div className="current-month">{month}</div>
              <div className="current-day">{day}</div>
              <div className="student-name">{studentInfo.studentName}</div>
              <div className="level-name">{levelName}</div>
              <div className="examiner-name">{examinerName}</div>
              <div className="school-name">{studentInfo.schoolName}</div>
              <table className="makeup-items">
                <tbody>
                  <ItemsRow
                    items={items}
                    indexs={[0, 1, 2, 3, 4]}
                    PassScore={PassScore}
                    isEnable={isEnable}
                  />
                  <ItemsRow
                    items={items}
                    indexs={[5, 6, 7, 8, 9]}
                    PassScore={PassScore}
                    isEnable={isEnable}
                  />
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    )
  }
}

export default MakeupExamCertif

const ItemsRow = ({ items, indexs, PassScore, isEnable }) => {
  return (
    <tr>
      {indexs.map((index) => {
        const item = items[index]
        if (!item) return <td key={index} />
        return (
          <td key={index}>
            <span>{item.itemName}</span>
            <CheckItem defaultChecked={!isEnable || item.score < PassScore} />
          </td>
        )
      })}
    </tr>
  )
}

const CheckItem = ({ defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="item-check" onClick={() => setChecked(!checked)}>
      {checked && <CheckOutlined />}
    </div>
  )
}

const getDate = () => {
  const date = new Date()
  const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate()
  return [date.getFullYear(), month, day]
}
