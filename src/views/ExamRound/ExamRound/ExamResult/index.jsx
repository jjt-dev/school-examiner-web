import React, { useState, useCallback } from 'react'
import { Dropdown } from 'antd'
import 'react-table-drag-select/style.css'
import './index.less'
import getContextMenu from './ContextMenu'
import ResultWithSelect from './ResultWithSelect'
import ResultWithSelect2 from './ResultWithSelect2'
import { buildCellStates } from '../../helper'
import { useEffect } from 'react'
import Totals from './Totals'

/**
 * react-table-drag-select不能通过redux的store更新，这里定义了两个一样的组件ResultWithSelect和ResultWithSelect2
 * 当右键选择等级的时候，显示ResultWithSelect2，当右键选择消失的时候，重新挂载ResultWithSelect, 这样可以利用初始值来得到最新值
 *
 * @param {*} props
 */
const ExamResult = (props) => {
  const {
    examRound,
    updateResultBatch,
    toggleResult,
    setToggleResult,
    isGradeMode,
    examFinish,
    clearMultSelect,
    setClearMultSelect,
  } = props
  const [cells, setCells] = useState(buildCellStates(examRound))
  const [contextMenuVisible, setContextMenuVisible] = useState(false)

  const resetCells = useCallback(() => {
    setCells(buildCellStates(examRound))
  }, [examRound])

  useEffect(() => {
    if (clearMultSelect) {
      resetCells()
      setClearMultSelect(false)
    }
  }, [clearMultSelect, resetCells, setClearMultSelect])

  const handleBatchScore = (score) => {
    const result = []
    // cells从第四行开始是考项，每一行从第二列开始对应考生
    cells
      .filter((cell, index1) => index1 > 2)
      .forEach((cell, index2) => {
        cell.forEach((item, index3) => {
          // 被选择的单元值是true
          if (item) {
            result.push({
              studentIndex: index3 - 1,
              itemIndex: index2,
              score,
            })
          }
        })
      })

    updateResultBatch(result)
    setToggleResult(!toggleResult)
    setContextMenuVisible(false)
    resetCells()
  }

  return (
    <>
      <Dropdown
        disabled={examFinish}
        overlay={getContextMenu(
          examRound.grades,
          handleBatchScore,
          isGradeMode
        )}
        trigger={['contextMenu']}
        onVisibleChange={(value) => {
          setToggleResult(!toggleResult)
          setContextMenuVisible(value)
        }}
        visible={contextMenuVisible}
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          {toggleResult ? (
            <ResultWithSelect {...props} cells={cells} setCells={setCells} />
          ) : (
            <ResultWithSelect2 {...props} cells={cells} setCells={setCells} />
          )}
        </a>
      </Dropdown>
      <Totals {...examRound} isGradeMode={isGradeMode} />
    </>
  )
}

export default ExamResult
