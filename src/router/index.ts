import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    showBack?: boolean
    showTabBar?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/mobile/home' },
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
    }
  ]
})

export default router
