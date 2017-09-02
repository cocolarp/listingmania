/* global BACKENT_URL */

import isnan from 'lodash.isnan'
import moment from 'moment'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import 'src/styles.css'

import * as models from './models'
import * as url from './url_utils'

import bus from './msgbus'

import {
  getPlaceDetails,
  getGoogleSheetsData,
} from './services/google'

import {client} from './services/backent'

import rootComponent from './components/root.vue'

const API_KEY = 'AIzaSyCDjYyOPVtg43sXCTvJtdHtlJySKa4EN0I'
const SPREADSHEET_ID = '1zQZM5nrsHXLO74MXa7EBnL4aUiJe6BhSvIRWWbRtDNc'
const SPREADSHEET_RANGE = 'PROCHAINS GNs FRANCE'

Vue.use(Vuex)
Vue.use(Vuetify)

moment.locale('fr')  // FIXME: Be international, detect and let the user choose!

const store = new Vuex.Store({
  state: {
    startDate: null,
    endDate: null,
    placeName: null,
    maxDistance: null,
    sortKey: 'start',
    rawLarps: [],
  },
  mutations: {
    init (state, value) {
      state.rawLarps = value
    },
    initDistances (state, {lat, lng}) {
      state.rawLarps.forEach((larp) => larp.computeDistance(lat, lng))
    },
    setMaxDistance (state, value) {
      state.maxDistance = value
    },
    setStartDate (state, value) {
      state.startDate = value
    },
    setEndDate (state, value) {
      state.endDate = value
    },
    setPlaceName (state, value) {
      state.placeName = value
    },
    setSortKey (state, value) {
      state.sortKey = value
    },
  },
})

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
    const clientData = await client.getEvents()
    rawLarps = models.transformBackentData(clientData)
  } else if (process.env.NODE_ENV !== 'production') {
    rawLarps = models.transformRawData(require('src/data.json'))
  } else {
    const sheetData = await getGoogleSheetsData(API_KEY, SPREADSHEET_ID, SPREADSHEET_RANGE)
    rawLarps = models.transformRawData(sheetData)
  }


  // TODO: Validate the parameters and void them if invalid
  store.commit('setStartDate', url.getMomentParam('start'))
  store.commit('setEndDate', url.getMomentParam('end'))
  store.commit('setSortKey', url.getStringParam('sortBy'))

  const maxDistance = parseInt(url.getStringParam('distance'), 10)
  const allowedValues = Object.keys(models.AVAILABLE_DISTANCES).map((d) => parseInt(d, 10))
  if (maxDistance && !isnan(maxDistance) && allowedValues.includes(maxDistance)) {
    store.commit('setMaxDistance', maxDistance)
  } else {
    url.updateParamsWith('distance', null)
  }

  store.commit('init', rawLarps)

  new Vue({  // eslint-disable-line no-new
    el: '#content',
    store,
    ...rootComponent,
  })

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
