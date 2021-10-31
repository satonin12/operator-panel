import RegisterPage from '../pages/RegisterPage/RegisterPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import RefreshPasswordPage from '../pages/RefreshPasswordPage/RefreshPasswordPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import HoomRoom from '../pages/HomeRoomPage/HoomRoom'

export const RouteNames = {
  LOGIN: '/login',
  REGISTER: '/register',
  REFRESH_PASSWORD: '/refresh-password',
  FORGOT_PASSWORD: '/forgot-password',

  HOMEPAGE: '/',
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
    path: RouteNames.FORGOT_PASSWORD,
    exact: true,
    component: ForgotPasswordPage,
  },
]

export const privateRoutes = [
  {
    path: RouteNames.HOMEPAGE,
    exact: true,
    component: HoomRoom,
  },
  {
    path: RouteNames.REFRESH_PASSWORD,
    exact: true,
    component: RefreshPasswordPage,
  },
]
