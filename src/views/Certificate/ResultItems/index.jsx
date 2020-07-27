import React from 'react'

const ResultItems = ({ resultItems = [] }) => {
  const viewItems = buildItemView(resultItems)
  return (
    <div className="item-result__items">
      {Object.keys(viewItems).map((key) => {
        return (
          <div key={key} className="item-result__items-item">
            {viewItems[key]}
          </div>
        )
      })}
    </div>
  )
}

export default ResultItems

const buildItemView = (resultItems) => {
  const result = {}
  const rowNum = 5
  const firstRowNameIndex = [0, 1, 2, 3, 4]
  const secondRowNameIndex = [5, 6, 7, 8, 9]
  const thirdRowNameIndex = [10, 11, 12, 13, 14]
  resultItems.forEach((item, index) => {
    const prop = item.scoreMode === 1 ? 'scoreLevel' : 'score'
    if (firstRowNameIndex.includes(index)) {
      result[index] = item.itemName
      result[index + rowNum] = item[prop]
    }
    if (secondRowNameIndex.includes(index)) {
      result[index + rowNum] = item.itemName
      result[index + 2 * rowNum] = item[prop]
    }
    if (thirdRowNameIndex.includes(index)) {
      result[index + 2 * rowNum] = item.itemName
      result[index + 3 * rowNum] = item[prop]
    }
  })
  return result
}
