import { useState, useEffect, useCallback, useRef } from 'react'
import { debounce } from 'lodash'
import { isNotEmpty, buildParameters } from 'src/utils/common'
import api from 'src/utils/api'
import { session } from 'src/utils/storage'

const defaultPageSizeOptions = ['10', '20', '30', '50', '100']

const useTableFetch = (defaultPath = null, options = {}) => {
  const { defaultValue = [], ...defaultSearch } = options
  const storageId = buildParameters(defaultPath, defaultSearch)
  const [path, setPath] = useState(defaultPath)
  const [data, setData] = useState(defaultValue)
  const [hasPagination, setHasPagination] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState()
  const [total, setTotal] = useState(0)
  const [forceRefreshCount, setForceRefreshCount] = useState(0)
  const [paginator, setPaignator] = useState(getSavedPaginator(storageId))
  const [filters, setFilters] = useState({})
  const defaultSearchRef = useRef(defaultSearch)
  const [search, setSearch] = useState({
    ...getSavedSearch(storageId),
    ...defaultSearchRef.current,
  })
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  }

  const resetPaginator = useCallback(() => {
    setPaignator((pre) => ({
      current: 1,
      pageSize: pre.pageSize,
    }))
  }, [])

  useEffect(() => {
    session.setItem(storageId, { paginator, search })
  }, [defaultPath, defaultSearch, paginator, search, storageId])

  /**
   * __tableChange__的命名方式是为了不被用户碰巧同名
   */
  const updateSearch = useCallback(
    (value) => {
      if (value.__tableChange__) {
        const {
          paginator: newPaginator,
          filters: newFilters,
        } = value.__tableChange__
        setPaignator({
          current: newPaginator.current,
          pageSize: newPaginator.pageSize,
        })
        setFilters(newFilters)
        return
      }

      if (value.__updateDefaultPageSize__) {
        setPaignator((pre) => ({
          ...pre,
          pageSize: value.__updateDefaultPageSize__,
        }))
        return
      }

      if (value.__updateHasPagination__ === false) {
        setHasPagination(false)
        return
      }

      if (value.__updateRefreshInterval__) {
        setRefreshInterval(value.__updateRefreshInterval__)
        return
      }

      const length = Object.keys(value).length
      setSearch(
        length
          ? (pre) => ({
              ...pre,
              ...value,
            })
          : defaultSearchRef.current
      )
      // 搜索条件变化的时候需要把分页重置
      resetPaginator()
    },
    [resetPaginator]
  )

  /**
   * value如果是string那么就是path,如果是object就是filter对象
   */
  const fetchTable = useCallback(
    (value) => {
      if (value) {
        const type = typeof value
        switch (type) {
          case 'string':
            setPath(value)
            resetPaginator()
            break

          case 'object':
            updateSearch(value)
            break

          default:
            break
        }
      } else {
        setForceRefreshCount((pre) => pre + 1)
      }
    },
    [resetPaginator, updateSearch]
  )

  useEffect(() => {
    let interval
    if (refreshInterval) {
      interval = setInterval(() => {
        setForceRefreshCount((pre) => pre + 1)
      }, refreshInterval)
    }
    return () => clearInterval(interval)
  }, [refreshInterval])

  const debouncedFetch = useCallback(
    debounce(
      async (
        path,
        search,
        paginator,
        filters,
        setData,
        setTotal,
        hasPagination
      ) => {
        setLoading(true)
        try {
          const { current, pageSize } = paginator
          path += `?page=${current}&rows=${pageSize}`
          Object.keys(search).forEach((key) => {
            if (isNotEmpty(search[key])) {
              path += `&${key}=${search[key]}`
            }
          })
          Object.keys(filters).forEach((key) => {
            if (isNotEmpty(filters[key])) {
              path += `&${key}=${filters[key]}`
            }
          })
          const result = await api.get(path)
          if (hasPagination) {
            setData(result.data)
            setTotal(result.totalRecords)
          } else {
            setData(result)
          }
        } finally {
          setLoading(false)
        }
      },
      200
    ),
    []
  )

  useEffect(() => {
    if (path) {
      debouncedFetch(
        path,
        search,
        paginator,
        filters,
        setData,
        setTotal,
        hasPagination
      )
    }
  }, [
    paginator,
    search,
    path,
    forceRefreshCount,
    debouncedFetch,
    filters,
    hasPagination,
  ])

  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: defaultPageSizeOptions,
    size: 'small',
    ...paginator,
    total,
  }

  return {
    dataSource: data,
    search,
    loading,
    fetchTable,
    pagination: hasPagination ? pagination : false,
    rowSelection,
    selectedRowKeys,
  }
}

export default useTableFetch

const getSavedPaginator = (storageId) => {
  const savedFilter = session.getItem(storageId)
  const defaultPaginator = {
    current: 1,
    pageSize: Number(defaultPageSizeOptions[0]),
  }
  return savedFilter?.paginator ?? defaultPaginator
}

const getSavedSearch = (storageId) => {
  const savedFilter = session.getItem(storageId)
  return savedFilter?.search ?? {}
}
