/* global BACKENT_URL, Backent */

import moment from 'moment'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'
import VueAnalytics from 'vue-analytics'
import Vuetify from 'vuetify' // TODO: tree shaking instead.

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'src/styles.css'
import translations from 'dist/translations.json'

import { getCurrentlySupportedLocale, getBrowserLanguage } from 'src/lang_utils'
import rootPage from './pages/root.vue'
import router from './routes'
import { client } from './services/backent'
import { getCurrency } from './storage'
import store from './store'

import { CURRENCY_EUR } from './enums'
import { computeConversionTable } from './models'

if (BACKENT_URL) {
  client.init(BACKENT_URL)
} else {
  console.log('Could not connect to backend, no URL was defined.')
}

window.Backent = client

const locale = getCurrentlySupportedLocale()

Vue.use(Vuetify)

Vue.use(GetTextPlugin, {
  translations: translations,
  defaultLanguage: locale,
  silent: true,
})

Vue.use(VueAnalytics, {
  id: 'UA-112821426-1',
  router,
})

moment.locale(getBrowserLanguage())

if (translations.hasOwnProperty(locale)) {
  const newTitle = translations[locale][document.title]
  if (newTitle != null && newTitle !== '') {
    document.title = translations[locale][document.title]
  }
}

async function bootstrapApplication () {

  Backent.getUser().then((user) => {
    store.commit('setUser', user)
  }, () => {
    console.log('User is not authenticated.')
  })

  const chosenCurrency = getCurrency() || CURRENCY_EUR
  store.commit('setCurrency', {
    currency: chosenCurrency,
    table: {
      [chosenCurrency]: 1.0,
    },
  })
  computeConversionTable(chosenCurrency).then((conversionTable) => {
    store.commit('setCurrency', {
      currency: chosenCurrency,
      table: conversionTable,
    })
  })

  new Vue( // eslint-disable-line no-new
    Object.assign({
      el: '#content',
      store,
      router,
    }, rootPage)
  )
}

bootstrapApplication()
