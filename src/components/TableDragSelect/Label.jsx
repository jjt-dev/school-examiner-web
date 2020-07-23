import React from 'react'

export function Label(props) {
  const { isSelecting, isSelected } = props

  return (
    <div className="card-label">
      Selecting: <span>{`${isSelecting}`}</span>
      <br />
      Selected: <span>{`${isSelected}`}</span>
    </div>
  )
}
