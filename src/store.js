/* global localStorage */

import Vue from 'vue'
import Vuex from 'vuex'

import {CURRENCY_EUR} from './models'

Vue.use(Vuex)

function removeItem (array, element) {
  const index = array.indexOf(element)
  array.splice(index, 1)
}


const store = new Vuex.Store({
  state: {
    user: null,
    currency: CURRENCY_EUR,
    conversionTable: {},
    events: [],
    detailEvent: null,
    loginFormDisplayed: false,
    logoutFormDisplayed: false,
    currencyFormDisplayed: false,
  },
  getters: {
    isLiked: (state) => (event) => {
      if (!state.user) return false // we don't know yet
      return state.user.events.includes(event.id)
    },
  },
  mutations: {
    computeDistance (state, latLng) {
      state.events.forEach((event, i) => {
        event.distance = event.computeDistance(latLng[0], latLng[1])
        Vue.set(state.events, i, event)
      })
    },
    registerEvents (state, value) {
      state.events = value
    },
    setCurrency (state, data) {
      localStorage.setItem('currency', data.currency)
      state.currency = data.currency
      state.conversionTable = data.table
    },
    updateCosts (state) {
      state.events.forEach((event, i) => {
        event.updateCosts(state.currency, state.conversionTable)
      })
    },
    showLoginForm (state, value) {
      if (value === true) window.scrollTo(0, 0)
      state.loginFormDisplayed = value
    },
    showLogoutForm (state, value) {
      if (value === true) window.scrollTo(0, 0)
      state.logoutFormDisplayed = value
    },
    showCurrencyForm (state, value) {
      if (value === true) window.scrollTo(0, 0)
      state.currencyFormDisplayed = value
    },
    setUser (state, value) {
      if (!value) {
        localStorage.clear()
        location.reload()
      } else {
        state.user = value
      }
    },
    addLike (state, slug) {
      if (!state.user.events.includes(slug)) {
        state.user.events.push(slug)
      }
    },
    dropLike (state, slug) {
      if (state.user.events.includes(slug)) {
        removeItem(state.user.events, slug)
      }
    },
  },
})

export default store
