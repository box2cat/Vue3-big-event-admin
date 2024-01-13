import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

//createRouter: 创建路由实例
//createWebHistory: history模式，地址栏不带'#'号
//createWebHashHistory: hash模式，地址栏带'#'号

//import.meta.env.BASE_URL：vite中的环境变量(可在vite.config.js中配置)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  //如果没有token,且访问非登录页，则拦截到'/login'     其他情况放行
  const userStore = useUserStore()
  if (userStore.token === '' && to.path !== '/login') {
    // userStore.setToken('')
    // userStore.setUser({})
    return '/login'
  }
})

export default router
