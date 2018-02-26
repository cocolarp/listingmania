/* global BACKENT_URL, Backent */

import moment from 'moment'

import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'

import 'src/styles.css'
import 'src/assets/fontello/css/listingmania-embedded.css'
import translations from 'dist/translations.json'

import rootPage from './pages/root.vue'
import router from './routes'
import {client} from './services/backent'
import {getCurrentlySupportedLocale, getBrowserLanguage} from 'src/lang_utils'
import store from './store'

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
})

moment.locale(getBrowserLanguage())

if (translations.hasOwnProperty(locale)) {
  const newTitle = translations[locale][document.title]
  if (newTitle != null && newTitle != '') {
    document.title = translations[locale][document.title]
  }
}

async function bootstrapApplication () {

  const userPromise = Backent.getUser()

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

  try {
    const user = await userPromise
    store.commit('setUser', user)
  } catch (_err) {
    console.log('User is not authenticated.')
  }

}

bootstrapApplication()
