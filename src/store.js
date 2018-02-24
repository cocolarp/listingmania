import Vue from 'vue'
import Vuex from 'vuex'

import * as url from './url_utils'

Vue.use(Vuex)

const bits2str = (arr) => arr.map((x) => x ? '1' : '0').join(',')
const str2bits = (value) => value.split(',').map((m) => parseInt(m, 10) === 1)

function popEvents () {
  const cards = document.getElementsByClassName('event-card')
  for (let card of cards) {
    card.classList.add('pop-animate')
    setTimeout(() => {
      card.classList.remove('pop-animate')
    }, 500)
  }
}

function addLikes (eventList, likedEventIds) {
  eventList.forEach((event) => {
    event.isLiked = likedEventIds.includes(event.id)
  })
}

function computeDistances (eventList, place) {
  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()
  eventList.forEach((event) => {
    event.computeDistance(lat, lng)
  })
}

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
    shakeLocationInput: false,
  },
  mutations: {
    init (state, eventList) {
      if (state.user && state.user.events) {
        addLikes(eventList, state.user.events)
      }
      if (state.place) {
        computeDistances(eventList, state.place)
      }
      state.rawEvents = eventList
    },
    showLoginForm (state, value) {
      if (value === true) window.scrollTo(0, 0)
      state.loginFormDisplayed = value
    },
    setUser (state, value) {
      if (!value) {
        localStorage.clear()
        location.reload()
      } else {
        state.user = value
        addLikes(state.rawEvents, state.user.events)
      }
    },
    toggleDurationFilter (state, index) {
      const nextValue = !state.durationFilter[index]
      Vue.set(state.durationFilter, index, nextValue)
      url.updateParamsWith('duration', bits2str(state.durationFilter))
      popEvents()
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
      popEvents()
    },
    toggleMonth (state, index) {
      const nextValue = !state.selectedMonths[index]
      Vue.set(state.selectedMonths, index, nextValue)
      url.updateParamsWith('months', bits2str(state.selectedMonths))
      popEvents()
    },
    updateAnyWhere (state, value) {
      url.updateParamsWith('anywhere', value)
      state.anyWhere = value
      popEvents()
    },
    toggleMyEventsOnly (state, value) {
      url.updateParamsWith('my_events', value)
      state.onlyMyEvents = value
      popEvents()
    },
    setMaxDistance (state, value) {
      url.updateParamsWith('distance', value || '')
      state.maxDistance = value
      popEvents()
    },
    setPlace (state, place) {
      url.updateParamsWith('place', place.place_id)
      state.place = place
      computeDistances(state.rawEvents, place)
    },
    resetPlace (state) {
      state.place = null
      url.updateParamsWith('place', null)
    },
    setSortKey (state, value) {
      url.updateParamsWith('sort', value)
      state.sortKey = value
      popEvents()
    },
    toggleMobileSearchBar (state) {
      state.hideMobileSearchBar = !state.hideMobileSearchBar
    },
    doShakeLocationInput (state) {
      state.shakeLocationInput = true
      setTimeout(() => {
        state.shakeLocationInput = false
      }, 1500)
    },
  },
})

export default store
