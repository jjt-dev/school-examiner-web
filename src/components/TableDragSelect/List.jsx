import React, { memo } from 'react'

import { DeselectAll, SelectAll } from 'react-selectable-fast'
import { Card } from './Card'

export const List = memo((props) => {
  const { items } = props

  return (
    <div>
      <p className="not-selectable">Press ESC to clear selection</p>
      <div className="button-container">
        <SelectAll component="button" type="button" className="btn">
          Select all
        </SelectAll>
        <DeselectAll component="button" type="button" className="btn">
          Clear selection
        </DeselectAll>
      </div>
      <div className="albums">
        {items.map((item) => (
          <Card key={item.year} player={item.player} year={item.year} />
        ))}
      </div>
    </div>
  )
})
