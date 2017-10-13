/* global BACKENT_URL */

import isnan from 'lodash.isnan'
import moment from 'moment'

import Vue from 'vue'
import Vuetify from 'vuetify'

import 'src/styles.css'

import * as models from './models'
import * as url from './url_utils'

import bus from './msgbus'
import store from './store'

import {
  getPlaceDetails,
} from './services/google'

import {client} from './services/backent'

import rootComponent from './components/root.vue'

Vue.use(Vuetify)

moment.locale('fr')  // FIXME: Be international, detect and let the user choose!

function distanceChanged (distance) {
  url.updateParamsWith('distance', distance)
  store.commit('setMaxDistance', distance)
}

function dateRangeChanged (dateRange) {
  url.updateParamsWith('start', dateRange[0].format('YYYY-MM'))
  url.updateParamsWith('end', dateRange[1].format('YYYY-MM'))
  store.commit('setStartDate', dateRange[0])
  store.commit('setEndDate', dateRange[1])
}

function placeChanged (place) {
  url.updateParamsWith('place', place.place_id)
  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()
  store.commit('initDistances', {lat, lng})
}

function sortChanged (key) {
  url.updateParamsWith('sortBy', key)
  store.commit('setSortKey', key)
}

async function bootstrapApplication () {
  let rawLarps = []

  if (BACKENT_URL) {
    client.init(BACKENT_URL)

    try {
      const user = await client.getUser()
      store.commit('setUser', user)
    } catch (_err) {
      console.log('User is not authenticated.')
    }

    const events = await client.getEvents()
    rawLarps = models.transformBackentData(events)
  }

  // TODO: Validate the parameters and void them if invalid
  store.commit('setStartDate', url.getMomentParam('start'))
  store.commit('setEndDate', url.getMomentParam('end'))

  const sortKey = url.getStringParam('sortBy')
  if (!sortKey) {
    sortChanged('start')
  } else {
    store.commit('setSortKey', sortKey)
  }

  const maxDistance = parseInt(url.getStringParam('distance'), 10)
  const allowedValues = Object.keys(models.AVAILABLE_DISTANCES).map((d) => parseInt(d, 10))
  if (maxDistance && !isnan(maxDistance) && allowedValues.includes(maxDistance)) {
    store.commit('setMaxDistance', maxDistance)
  } else {
    url.updateParamsWith('distance', null)
  }

  store.commit('init', rawLarps)

  new Vue(  // eslint-disable-line no-new
    Object.assign({
      el: '#content',
      store,
    }, rootComponent)
  )

  const placeId = url.getStringParam('place')
  if (placeId) {
    try {
      const place = await getPlaceDetails(placeId)
      store.commit('setPlaceName', place.formatted_address)
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      rawLarps.forEach((larp) => larp.computeDistance(lat, lng))
    } catch (err) {
      console.warn('Place not found for id: ', placeId)
    }
  }

  bus.$on('date_range_changed', dateRangeChanged)
  bus.$on('distance_changed', distanceChanged)
  bus.$on('place_changed', placeChanged)
  bus.$on('sort_changed', sortChanged)
}

bootstrapApplication()
