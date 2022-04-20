// 约定式路由 此文件作废
export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // 配置后台
  {
    path: '/back',
    component: '../layouts/BackLayout',
    routes: [
      { path: '/back', redirect: '/back/indicator' },
      { path: '/back/workbench', component: './Back/Workbench' },
      { path: '/back/indicator', component: './Back/Indicator' },
      { path: '/back/indicatorDetail', component: './Back/IndicatorDetail' },
      { path: '/back/dbInstance', component: './Back/DbInstance' },
      { path: '/back/dbInstanceDetail', component: './Back/DbInstanceDetail' },
      { path: '/back/scriptLibrary', component: './Back/ScriptLibrary' },
      { path: '/back/scriptLibraryDetail', component: './Back/ScriptLibraryDetail' },
      { path: '/back/dataCollection', component: './Back/DataCollection' },
      { path: '/back/dataCollectionDetail', component: './Back/DataCollectionDetail' },
    ],
  },
  // 数据前台
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/transaction/detail/order' },
      {
        name: 'transaction',
        icon: 'bar-chart',
        path: '/transaction/detail/order',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/transaction',
            redirect: '/transaction/detail/order',
          },
          {
            name: 'details',
            path: '/transaction/detail',
            routes: [
              {
                path: '/transaction/detail',
                redirect: '/transaction/detail/order',
              },
              {
                path: '/transaction/detail/order',
                name: 'order',
                component: './Transaction/Detail/OrderView',
              },
            ],
          },
        ],
      },
      {
        name: 'my',
        icon: 'user',
        path: '/my/center',
        hideInMenu: true,
        routes: [
          {
            path: '/my',
            redirect: '/my/center',
          },
          {
            name: 'center',
            path: '/my/center',
            component: './My/CenterView',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
