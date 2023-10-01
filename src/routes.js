import { lazy } from 'react'
const routes = [
  {
    name: 'Home',
    path: '/',
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
  }
]
export default routes

