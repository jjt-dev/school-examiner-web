import { useState, useEffect, useCallback } from 'react'
import api from 'src/utils/api'
import { useDispatch } from 'react-redux'
import { showLoadingBar, closeLoadingBar } from 'src/actions/app'

const useFetch = (defaultPath, defaultValue, { params = null } = {}) => {
  const dispatch = useDispatch()
  const [path, setPath] = useState(defaultPath)
  const [data, setData] = useState(defaultValue)
  const [forceRefreshCount, setForceRefreshCount] = useState(0)

  const refetch = useCallback((path) => {
    if (path) {
      setPath(path)
    }
    setForceRefreshCount((pre) => pre + 1)
  }, [])

  useEffect(() => {
    const fetchData = async ({ path, params }) => {
      try {
        dispatch(showLoadingBar())
        const result = await api.get(path, params)
        setData(result)
        dispatch(closeLoadingBar())
      } catch (error) {
        console.log(error)
        dispatch(closeLoadingBar())
      }
    }
    if (path) {
      fetchData({ path, params })
    }
  }, [path, params, forceRefreshCount, dispatch])

  return [data, refetch]
}

export default useFetch
