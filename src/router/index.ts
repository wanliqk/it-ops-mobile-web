import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/storage'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    showBack?: boolean
    showTabBar?: boolean
    /** 公开页面，无需登录即可访问 */
    public?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/mobile/home' },
    { path: '/mobile', redirect: '/mobile/home' },
    { path: '/mobile/', redirect: '/mobile/home' },
    {
      path: '/mobile/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录', showBack: false, showTabBar: false, public: true }
    },
    {
      path: '/mobile/home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'IT报修服务', showBack: false, showTabBar: true }
    },
    {
      path: '/mobile/repair/create',
      name: 'repair-create',
      component: () => import('@/views/RepairCreate.vue'),
      meta: { title: '发起报修', showBack: true, showTabBar: false }
    },
    {
      path: '/mobile/repair/list',
      name: 'repair-list',
      component: () => import('@/views/RepairList.vue'),
      meta: { title: '我的报修', showBack: false, showTabBar: true }
    },
    {
      path: '/mobile/repair/detail/:id',
      name: 'repair-detail',
      component: () => import('@/views/RepairDetail.vue'),
      meta: { title: '工单详情', showBack: true, showTabBar: false }
    },
    {
      path: '/mobile/faq',
      name: 'faq',
      component: () => import('@/views/Faq.vue'),
      meta: { title: '常见问题', showBack: false, showTabBar: true }
    },
    { path: '/:pathMatch(.*)*', redirect: '/mobile/home' }
  ]
})

router.beforeEach(to => {
  const loggedIn = !!getToken()

  if (!to.meta.public && !loggedIn) {
    return { path: '/mobile/login', query: { redirect: to.fullPath } }
  }

  if (to.path === '/mobile/login' && loggedIn) {
    return '/mobile/home'
  }

  return true
})

export default router
