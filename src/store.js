import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    loginFormDisplayed: false,
    startDate: null,
    endDate: null,
    placeName: null,
    maxDistance: null,
    sortKey: 'start',
    rawLarps: [],
  },
  mutations: {
    showLoginForm (state, value) {
      state.loginFormDisplayed = value
    },
    setUser (state, value) {
      state.user = value
    },
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

export default store
