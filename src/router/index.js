import RegisterPage from '../pages/RegisterPage/RegisterPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import RefreshPasswordPage from '../pages/RefreshPasswordPage/RefreshPasswordPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'

export const RouteNames = {
  LOGIN: '/login',
  REGISTER: '/register',
  REFRESH_PASSWORD: '/refresh-password',
  FORGOT_PASSWORD: '/forgot-password',
}

export const publicRoutes = [
  {
    path: RouteNames.LOGIN,
    exact: true,
    component: LoginPage,
  },
  {
    path: RouteNames.REGISTER,
    exact: true,
    component: RegisterPage,
  },
  {
    path: RouteNames.REFRESH_PASSWORD,
    exact: true,
    component: RefreshPasswordPage,
  },
  {
    path: RouteNames.FORGOT_PASSWORD,
    exact: true,
    component: ForgotPasswordPage,
  },
]

export const privateRoutes = [{}, {}]
