import Vue from 'vue'
import VueRouter from 'vue-router'

import SearchPage from './pages/search'
import listPage from './pages/list.vue'

import detailPage from './pages/detail.vue'

import aboutPage from './pages/about.vue'
import faqPage from './pages/faq.vue'
import termsPage from './pages/terms.vue'
import mapPage from './pages/map.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: SearchPage },
  { path: '/events', name: 'events', component: listPage },
  { path: '/event/:slug', name: 'detail', component: detailPage },

  { path: '/about', component: aboutPage },
  { path: '/faq', component: faqPage },
  { path: '/terms', component: termsPage },
  { path: '/map', component: mapPage },
]

const router = new VueRouter({
  routes,
})

export default router
