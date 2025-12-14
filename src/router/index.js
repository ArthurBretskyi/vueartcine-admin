import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import ImportView from '@/views/admin/ImportView.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    // meta: { requiresAdmin: true },
    children: [
      {
        path: 'import',
        name: 'AdminImport',
        component: ImportView,
        // meta: { requiresAdmin: true },
      },
      {
        path: 'collections',
        name: 'AdminCollections',
        component: () => import('@/views/admin/CollectionsView.vue'),
        // meta: { requiresAdmin: true },
      },
    ],
  },
  { path: '/map', name: 'MapView', component: MapView },
  {
    path: '/now-in-cinemas',
    name: 'NowInCinemas',
    component: () => import('@/views/NowInCinemasView.vue'),
  },
  {
    path: '/soon-in-cinemas',
    name: 'SoonInCinemas',
    component: () => import('@/views/SoonInCinemasView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
