import React from 'react'
import { confirmUpdate } from 'src/utils/common'
import ListHeader from '../ListHeader'
import CustomTable from '../CustomTable'
import useActiveRoute from 'src/hooks/useActiveRoute'
import useTableFetch from 'src/hooks/useTableFetch'

const PageList = ({
  columns,
  showAdd = true,
  addCallback,
  deleteCallback,
  defaultTableList,
  placeholder = '请输入查询条件',
  rowKey = 'id',
  path,
  children,
  size = 'middle',
  title: defaultTitle,
  customClass = '',
  defaultSearch = {},
}) => {
  const {
    editPath,
    title,
    titleProp = 'name',
    apiPath = editPath,
  } = useActiveRoute()

  let fetchPath = ''
  if (!defaultTableList) {
    fetchPath = path ? path : `${apiPath}/page`
  }
  let tableList = useTableFetch(fetchPath, defaultSearch)
  if (defaultTableList) {
    tableList = defaultTableList
  }

  // addCallback如果没有值，则取list的编辑路径
  if (!addCallback) {
    addCallback = editPath
  }

  const updateEntityStatus = (entity) => {
    const { isEnable } = entity
    const payload = {
      status: isEnable ? '禁用' : '启用',
      title,
      titleValue: entity[titleProp],
      path: `${apiPath}/enable?id=${entity.id}&isEnable=${!isEnable}`,
      callback: tableList.fetchTable,
    }
    confirmUpdate(payload)
  }

  const deleteEntity = (entity) => {
    const payload = {
      status: '删除',
      title,
      titleValue: entity[titleProp],
      path: `${apiPath}/del?id=${entity.id}`,
      callback: () => {
        tableList.fetchTable()
        deleteCallback && deleteCallback()
      },
    }
    confirmUpdate(payload)
  }

  return (
    <div className={`page page-list ${customClass}`}>
      <div className="page-list-title">{defaultTitle ?? title}列表</div>
      {children}
      {!children && (
        <ListHeader
          {...tableList}
          showAdd={showAdd}
          addCallback={addCallback}
          placeholder={placeholder}
        />
      )}
      <CustomTable
        {...tableList}
        columns={columns(deleteEntity, updateEntityStatus)}
        rowKey={rowKey}
        size={size}
      />
    </div>
  )
}

export default PageList
