import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { RouteNames, publicRoutes, privateRoutes } from './index'

const AppRouter = () => {
  const auth = false

  return auth === true ? (
    <Switch>
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
      <Redirect to="/" />
    </Switch>
  ) : (
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
