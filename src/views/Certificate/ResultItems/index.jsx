import React from 'react'

const ResultItems = ({ resultItems = [] }) => {
  return (
    <div className="item-result__items">
      {Array.from(Array(30).keys()).map((index) => {
        let content = ''
        if (resultItems[index]) {
          content = resultItems[index].itemName
        } else if (resultItems[index - 5]) {
          content = resultItems[index - 5].score
        }
        return (
          <div key={index} className="item-result__items-item">
            {content}
          </div>
        )
      })}
    </div>
  )
}

export default ResultItems
