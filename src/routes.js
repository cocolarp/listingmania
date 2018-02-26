import Vue from 'vue'
import VueRouter from 'vue-router'

import homePage from './pages/home.vue'
import listPage from './pages/list.vue'

import detailPage from './pages/detail.vue'

import aboutPage from './pages/about.vue'
import faqPage from './pages/faq.vue'
import mapPage from './pages/map.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: homePage },
  { path: '/events', name: 'events', component: listPage },
  { path: '/event/:slug', name: 'detail', component: detailPage },

  { path: '/about', component: aboutPage },
  { path: '/faq', component: faqPage },
  { path: '/map', component: mapPage },

  {
    path: '*',
    component: homePage,
    beforeEnter: (to, from, next) => {
      next('/')
    },
  },
]

const router = new VueRouter({
  routes,
})

export default router
