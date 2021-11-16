import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { RouteNames, publicRoutes, privateRoutes } from './index'
import { useSelector } from 'react-redux'

const AppRouter = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return isAuth
    ? (
      <Switch>
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
        <Redirect to={RouteNames.HOMEPAGE} />
      </Switch>
      )
    : (
      <Switch>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
        <Redirect to={RouteNames.LOGIN} />
      </Switch>
      )
}

export default AppRouter
