/* global BACKENT_URL, Backent */

import isnan from 'lodash.isnan'
import moment from 'moment'

import Vue from 'vue'
import GetTextPlugin from 'vue-gettext'

import 'src/styles.css'
import 'src/assets/fontello/css/listingmania-embedded.css'
import translations from 'dist/translations.json'

import * as models from './models'
import rootPage from './pages/root.vue'
import router from './routes'
import {client} from './services/backent'
import {getPlaceDetails} from './services/google'
import {getCurrentlySupportedLocale, getBrowserLanguage} from 'src/lang_utils'
import store from './store'
import * as url from './url_utils'

if (BACKENT_URL) {
  client.init(BACKENT_URL)
} else {
  console.log('Could not connect to backend, no URL was defined.')
}

window.Backent = client

Vue.use(GetTextPlugin, {
  translations: translations,
  defaultLanguage: getCurrentlySupportedLocale(),
})

moment.locale(getBrowserLanguage())

function updateStoreFromUrl (urlParam, storeMutation, castCallback = (x) => x) {
  const value = url.getStringParam(urlParam)
  if (value) {
    store.commit(storeMutation, castCallback(value))
  }
}

const str2bool = (x) => x === 'true'

async function bootstrapApplication () {

  document.addEventListener('click', (event) => {
    let item = event.target.closest('.button')
    if (item) {
      item.classList.add('pop-animate')
      setTimeout(() => {
        item.classList.remove('pop-animate')
      }, 1000)
    }
  })

  updateStoreFromUrl('sort', 'setSortKey')
  updateStoreFromUrl('duration', 'initDurationFilter')
  updateStoreFromUrl('months', 'initMonths')
  updateStoreFromUrl('anywhere', 'updateAnyWhere', str2bool)
  updateStoreFromUrl('my_events', 'toggleMyEventsOnly', str2bool)

  const maxDistance = parseInt(url.getStringParam('distance'), 10)
  const allowedValues = Object.keys(models.AVAILABLE_DISTANCES).map((d) => parseInt(d, 10))

  new Vue( // eslint-disable-line no-new
    Object.assign({
      el: '#content',
      store,
      router,
    }, rootPage)
  )

  try {
    const user = await Backent.getUser()
    store.commit('setUser', user)
  } catch (_err) {
    console.log('User is not authenticated.')
  }

  if (maxDistance && !isnan(maxDistance) && allowedValues.includes(maxDistance)) {
    store.commit('setMaxDistance', maxDistance)
  }

  const placeId = url.getStringParam('place')
  if (placeId) {
    try {
      const place = await getPlaceDetails(placeId)
      store.commit('setPlace', place)
    } catch (err) {
      console.log(err)
      console.warn('Place not found for id: ', placeId)
    }
  }
}

bootstrapApplication()
