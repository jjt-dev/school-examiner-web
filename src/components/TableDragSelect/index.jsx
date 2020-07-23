import React from 'react'

import { SelectableGroup } from 'react-selectable-fast'
import { List } from './List'

const players = [
  'Michael Jordan',
  'Kobe Bryant',
  'Wilt Chamberlain',
  'Magic Johnson',
  'Kareem Abdul-Jabbar',
  'Kevin Durant',
  'Tim Duncan',
  'Larry Bird',
  'Shaquille ONeal',
  'Jerry West',
  'Moses Malone',
  'Karl Malone',
  'Julius Erving',
  'Kevin Garnett',
  'Charles Barkley',
  'Dirk Nowitzki',
  'Scottie Pippen',
  'Dwyane Wade',
  'David Robinson',
  'Stephen Curry',
  'Vince Carter',
  'Clyde Drexler',
  'Patrick Ewing',
  'Steve Nash',
  'Jason Kidd',
  'Allen Iverson',
  'Paul Pierce',
  'Gary Payton',
  'Ray Allen',
  'Dwight Howard',
  'Chris Paul',
]

const items = Array.from({ length: 30 }).map((_, index) => ({
  year: index + 1,
  player: players[index % players.length],
}))

const TableDragSelect = () => {
  const getSelectableGroupRef = (ref) => {
    window.selectableGroup = ref
  }

  const handleSelecting = (selectingItems) => {
    console.log(selectingItems)
  }

  const handleSelectionFinish = (selectedItems) => {
    console.log('Handle selection finish', selectedItems.length)
  }

  const handleSelectedItemUnmount = (_unmountedItem, selectedItems) => {
    console.log('hadneleSelectedItemUnmount')
  }

  const handleSelectionClear = () => {
    console.log('Cancel selection')
  }

  return (
    <div>
      <SelectableGroup
        ref={getSelectableGroupRef}
        className="main"
        clickClassName="tick"
        enableDeselect={true}
        tolerance={0}
        deselectOnEsc={true}
        allowClickWithoutSelected={false}
        duringSelection={handleSelecting}
        onSelectionClear={handleSelectionClear}
        onSelectionFinish={handleSelectionFinish}
        onSelectedItemUnmount={handleSelectedItemUnmount}
        ignoreList={['.not-selectable']}
      >
        <List items={items} />
      </SelectableGroup>
    </div>
  )
}

export default TableDragSelect
