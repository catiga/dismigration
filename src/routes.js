import { lazy } from 'react'
const routes = [
  {
    name: 'Index',
    path: '/',
    ico:'index',
    exact:true,
    compontent: lazy(() => import('./pages/index/index'))
  },
  {
    name: 'Home',
    path: '/home',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/home/index'))
  },
  {
    name: 'Migration',
    path: '/migration',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/migration/index'))
  },
  {
    name: 'Pledge',
    path: '/pledge',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/pledge/pledge'))
  },
  {
    name: 'Yield',
    path: '/yield',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/yield/yield'))
  },
  {
    name: 'P',
    path: '/p',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/p/p'))
  },
]
export default routes

