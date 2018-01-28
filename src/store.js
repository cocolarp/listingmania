import Vue from 'vue'
import Vuex from 'vuex'

import * as url from './url_utils'

Vue.use(Vuex)

const bits2str = (arr) => arr.map((x) => x ? '1' : '0').join(',')
const str2bits = (value) => value.split(',').map((m) => parseInt(m, 10) === 1)

const store = new Vuex.Store({
  state: {
    user: null,
    loginFormDisplayed: false,
    selectedMonths: Array(13).fill(true),
    anyWhere: true,
    onlyMyEvents: false,
    place: null,
    maxDistance: 500,
    sortKey: 'start',
    durationFilter: Array(3).fill(true),
    rawEvents: [],
    hideMobileSearchBar: true,
  },
  mutations: {
    init (state, value) {
      state.rawEvents = value
    },
    showLoginForm (state, value) {
      state.loginFormDisplayed = value
    },
    setUser (state, value) {
      state.user = value
    },
    toggleDurationFilter (state, index) {
      const nextValue = !state.durationFilter[index]
      Vue.set(state.durationFilter, index, nextValue)
      url.updateParamsWith('duration', bits2str(state.durationFilter))
    },
    initMonths (state, value) {
      state.selectedMonths = str2bits(value)
    },
    initDurationFilter (state, value) {
      state.durationFilter = str2bits(value)
    },
    updateAnyTime (state, value) {
      state.selectedMonths = Array(13).fill(value)
      url.updateParamsWith('months', bits2str(state.selectedMonths))
    },
    toggleMonth (state, index) {
      const nextValue = !state.selectedMonths[index]
      Vue.set(state.selectedMonths, index, nextValue)
      url.updateParamsWith('months', bits2str(state.selectedMonths))
    },
    updateAnyWhere (state, value) {
      url.updateParamsWith('anywhere', value)
      state.anyWhere = value
    },
    toggleMyEventsOnly (state, value) {
      url.updateParamsWith('my_events', value)
      state.onlyMyEvents = value
    },
    setMaxDistance (state, value) {
      url.updateParamsWith('distance', value || '')
      state.maxDistance = value
    },
    setPlace (state, place) {
      url.updateParamsWith('place', place.place_id)
      state.place = place
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      state.rawEvents.forEach((event) => event.computeDistance(lat, lng))
    },
    setSortKey (state, value) {
      url.updateParamsWith('sort', value)
      state.sortKey = value
    },
    toggleMobileSearchBar (state) {
      state.hideMobileSearchBar = !state.hideMobileSearchBar
    }
  },
})

export default store
