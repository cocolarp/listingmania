import Vue from 'vue'
import Vuex from 'vuex'

import { CURRENCY_EUR } from './enums'
import { clearUserData, saveCurrency } from 'src/storage'

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
      if (!event) return false
      return state.user.events.includes(event.pk)
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
      saveCurrency(data.currency)
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
        clearUserData()
        location.reload()
      } else {
        state.user = value
      }
    },
    addLike (state, pk) {
      if (!state.user.events.includes(pk)) {
        state.user.events.push(pk)
      }
    },
    dropLike (state, pk) {
      if (state.user.events.includes(pk)) {
        removeItem(state.user.events, pk)
      }
    },
  },
})

export default store
