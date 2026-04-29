import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import NewUsers from '../views/NewUsers.vue'

function checkauth () {
  const auth = useAuthStore()
  return auth.check()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      beforeEnter: checkauth,
      component: Dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/newusers',
      name: 'newusers',
      component: NewUsers
    }
  ]
})

export default router
