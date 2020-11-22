import { Button, Input } from 'antd'
import React, { useState } from 'react'
import { useHistory } from 'react-router'

const ListHeader = ({
  fetchTable,
  search: defaultSearch,
  showAdd,
  addCallback,
  placeholder = '请输入查询条件',
}) => {
  const history = useHistory()
  const [search, setSearch] = useState(defaultSearch?.keyword ?? '')

  const handleSearch = () => {
    fetchTable({ keyword: search })
  }

  const clearSearch = () => {
    setSearch('')
    fetchTable({ keyword: '' })
  }

  const handleAdd = () => {
    if (typeof addCallback === 'string') {
      history.push(addCallback)
      return
    }
    addCallback()
  }

  return (
    <div className="list-header">
      <Button
        type="primary"
        onClick={handleAdd}
        style={{ visibility: showAdd ? 'visible' : 'hidden' }}
      >
        新增
      </Button>
      <div className="list-header-right">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          placeholder={placeholder}
          style={{ width: 220 }}
        />
        <Button className="mr-10" onClick={handleSearch}>
          搜索
        </Button>
        <Button onClick={clearSearch}>清空</Button>
      </div>
    </div>
  )
}

export default ListHeader
