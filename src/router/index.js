import Vue from 'vue'
import VueRouter from 'vue-router'
import MyTemplates from '@/components/MyTemplates.vue'
import MyGuider from '@/components/MyGuider.vue'
import MyAccount from '@/components/MyAccount.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '',
    name: 'index',
    redirect: {name: 'templates'}
  },
  {
    path: '/templates',
    name: 'templates',
    component: MyTemplates    
  },
  {
    path: '/guider',
    name: 'guider',
    component: MyGuider
  },
  {
    path: '/account',
    name: 'account',
    component: MyAccount
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
