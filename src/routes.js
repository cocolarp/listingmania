import Vue from 'vue'
import VueRouter from 'vue-router'

import landingPage from './pages/search/landing.vue'
import eventsPage from './pages/search/events.vue'

import detailPage from './pages/detail.vue'

import aboutPage from './pages/about.vue'
import faqPage from './pages/faq.vue'
import mapPage from './pages/map.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: landingPage },
  { path: '/events', name: 'events', component: eventsPage },
  { path: '/event/:slug', name: 'detail', component: detailPage },

  { path: '/about', component: aboutPage },
  { path: '/faq', component: faqPage },
  { path: '/map', component: mapPage },

  {
    path: '*',
    component: landingPage,
    beforeEnter: (to, from, next) => {
      next('/')
    },
  },
]

const router = new VueRouter({
  routes,
})

export default router
