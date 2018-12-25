/* global BACKENT_URL, Backent */

import moment from 'moment'

import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'
import VueAnalytics from 'vue-analytics'

import 'src/styles.css'
import 'src/assets/fontello/css/listingmania-embedded.css'
import translations from 'dist/translations.json'

import rootPage from './pages/root.vue'
import router from './routes'
import { client } from './services/backent'
import { getCurrentlySupportedLocale, getBrowserLanguage } from 'src/lang_utils'
import store from './store'

import { CURRENCY_EUR, computeConversionTable } from './models'

if (BACKENT_URL) {
  client.init(BACKENT_URL)
} else {
  console.log('Could not connect to backend, no URL was defined.')
}

window.Backent = client

const locale = getCurrentlySupportedLocale()

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

  const chosenCurrency = localStorage.getItem('currency') || CURRENCY_EUR
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

  document.addEventListener('click', (event) => {
    let item = event.target.closest('.button')
    if (item) {
      item.classList.add('pop-animate')
      setTimeout(() => {
        item.classList.remove('pop-animate')
      }, 1000)
    }
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
