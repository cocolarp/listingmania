/* global BACKENT_URL */

import isnan from 'lodash.isnan'
import moment from 'moment'

import Vue from 'vue'

import 'src/styles.css'

import * as models from './models'
import * as url from './url_utils'

import bus from './msgbus'
import router from './routes'
import store from './store'

import {
  getPlaceDetails,
} from './services/google'

import {client} from './services/backent'

import rootPage from './pages/root.vue'

moment.locale('fr')  // FIXME: Be international, detect and let the user choose!

function updateStoreFromUrl (urlParam, storeMutation, castCallback = (x) => x) {
  const value = url.getStringParam(urlParam)
  if (value) {
    store.commit(storeMutation, castCallback(value))
  }
}

const str2bool = (x) => x === 'true'

async function bootstrapApplication () {
  let rawEvents = []

  if (BACKENT_URL) {
    client.init(BACKENT_URL)
    try {
      const user = await client.getUser()
      store.commit('setUser', user)
    } catch (_err) {
      console.log('User is not authenticated.')
    }
    const events = await client.getEvents()
    rawEvents = models.transformBackentData(events)
  }

  updateStoreFromUrl('sort', 'setSortKey')
  updateStoreFromUrl('duration', 'initDurationFilter')
  updateStoreFromUrl('months', 'initMonths')
  updateStoreFromUrl('anywhere', 'updateAnyWhere', str2bool)
  updateStoreFromUrl('my_events', 'toggleMyEventsOnly', str2bool)

  const maxDistance = parseInt(url.getStringParam('distance'), 10)
  const allowedValues = Object.keys(models.AVAILABLE_DISTANCES).map((d) => parseInt(d, 10))
  if (maxDistance && !isnan(maxDistance) && allowedValues.includes(maxDistance)) {
    store.commit('setMaxDistance', maxDistance)
  }

  store.commit('init', rawEvents)

  new Vue(  // eslint-disable-line no-new
    Object.assign({
      el: '#content',
      store,
      router,
    }, rootPage)
  )

  const placeId = url.getStringParam('place')
  if (placeId) {
    try {
      const place = await getPlaceDetails(placeId)
      store.commit('setPlace', place)
    } catch (err) {
      console.warn('Place not found for id: ', placeId)
    }
  }
}

bootstrapApplication()
