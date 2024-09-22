import { createWebHistory, createRouter } from 'vue-router'
import PublicHome from '@/pages/UsersList.vue'
import UserInDetails from '@/pages/UserInDetails.vue'
import LoginPage from '@/pages/LoginPage.vue'
import HomePage from '@/pages/HomePage.vue'
import { useUserStore } from '@/stores/userStore'
import Subjects from '@/pages/Subjects.vue'
import SubjectInDetails from '@/pages/SubjectInDetails.vue'

const routes = [
  {
    path: '/',
    component: PublicHome,
    meta: { requiresAuth: true}
  },

  {
    path: '/Subjects',
    component: Subjects,
    meta: { requiresAuth: true }
  },

  
  {
    path: '/subjects/:id',
    component: SubjectInDetails,
    meta: { requiresAuth: true }
  },

  {
    path: '/subjects/new',
    component: SubjectInDetails,
    meta: { requiresAuth: true, adminOnly: true } 
  },

  {
    path: '/Home',
    component: HomePage,
    meta: { requiresAuth: true}
  },

  {
    path: '/users/:id',
    component: UserInDetails,
    meta: { requiresAuth: true, adminOnly: true } 
  },
  {
    path: '/users/new',
    component: UserInDetails,
    meta: { requiresAuth: true, adminOnly: true } 
  },
  {
    path: '/login',
    component: LoginPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      next('/login') 
    } else if (to.meta.adminOnly && userStore.role !== 'admin') {
      next('/') 
    } else {
      next() 
    }
  } else {
    next() 
  }
})
