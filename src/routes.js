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
    name: 'Migration',
    path: '/migration/start',
    ico:'home',
    exact:true,
    compontent: lazy(() => import('./pages/migration/migration'))
  },
]
export default routes

