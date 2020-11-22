import { useMemo } from 'react'
import { matchPath, useLocation } from 'react-router'
import { routes } from 'src/views/Router'

const useActiveRoute = () => {
  const location = useLocation()
  const activeRoute = useMemo(() => {
    return routes.find(
      (route) =>
        !!matchPath(location.pathname, { path: route.path, exact: true })
    )
  }, [location.pathname])

  return activeRoute ?? {}
}

export default useActiveRoute
