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

  const isLoginPage = useMemo(() => location.pathname.startsWith('/login'), [
    location,
  ])
  const isNextGroup = useMemo(
    () => location.pathname.startsWith('/next-group'),
    [location]
  )

  return { ...activeRoute, isLoginPage, isNextGroup } ?? {}
}

export default useActiveRoute
