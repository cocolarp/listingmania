import Vue from 'vue'
import VueRouter from 'vue-router'

import SearchPage from './pages/search'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: SearchPage },
]

const router = new VueRouter({
  routes,
})

export default router
