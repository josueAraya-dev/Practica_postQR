import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TabsPage from '../views/TabsPage.vue';

import { hasSession } from '@/features/auth/session';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tabs/tab1',
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1',
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
      },
      {
        path: 'tab4',
        component: () => import('@/views/Tab4Page.vue'),
      },
    ],
  },
  {
    path: '/users/:id',
    component: () => import('@/views/Users/UserPage.vue'),
  },
  {
    path: '/orders/:id',
    component: () => import('@/views/Orders/OrderPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Toda la app requiere sesión, excepto las rutas marcadas como públicas (el login)
router.beforeEach((to) => {
  const isPublic = to.meta.public === true;
  if (!isPublic && !hasSession()) return '/login';
  if (isPublic && hasSession()) return '/tabs/tab1';
});

export default router;
