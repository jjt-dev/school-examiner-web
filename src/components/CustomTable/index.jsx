import React from 'react'
import { Table } from 'antd'
import useTableFetch from 'src/hooks/useTableFetch'

const CustomTable = ({
  pagination,
  fetchTable,
  showPagination = true,
  showRowSelection = false,
  rowSelection,
  defaultPageSize,
  pageSizeOptions,
  refreshInterval,
  ...tableProps
}) => {
  rowSelection = showRowSelection ? rowSelection : null
  let finalPagination
  if (pagination) {
    finalPagination = {
      ...pagination,
      showTotal: (totalNum) => showTotal(totalNum, rowSelection),
    }
    if (pageSizeOptions) {
      finalPagination.pageSizeOptions = pageSizeOptions
    }
  }

  React.useEffect(() => {
    if (defaultPageSize) {
      fetchTable({ __updateDefaultPageSize__: defaultPageSize })
    }
  }, [defaultPageSize, fetchTable])

  React.useEffect(() => {
    if (!showPagination) {
      fetchTable({ __updateHasPagination__: false })
    }
  }, [showPagination, fetchTable])

  React.useEffect(() => {
    if (refreshInterval) {
      fetchTable({ __updateRefreshInterval__: refreshInterval })
    }
  }, [refreshInterval, fetchTable])

  return (
    <Table
      {...tableProps}
      loading={false}
      bordered={true}
      rowSelection={rowSelection}
      pagination={pagination && finalPagination}
      onChange={(paginator, filters) =>
        fetchTable({ __tableChange__: { paginator, filters } })
      }
    />
  )
}

CustomTable.useTableFetch = useTableFetch

export default CustomTable

const showTotal = (total, rowSelection) => {
  return (
    <div className="ant-pagation-total">
      {rowSelection ? (
        <div className="ant-pagation-total-selected">
          已选择
          <span>
            {` ${
              (rowSelection.selectedRowKeys &&
                rowSelection.selectedRowKeys.length) ||
              0
            }/${total} `}
          </span>
          项 <a onClick={() => rowSelection.onChange([], [])}>清空</a>
        </div>
      ) : null}
      <div>{`共${total}条`}</div>
    </div>
  )
}
