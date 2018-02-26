import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function removeItem (array, element) {
  const index = array.indexOf(element)
  array.splice(index, 1)
}


const store = new Vuex.Store({
  state: {
    user: null,
    loginFormDisplayed: false,
  },
  getters: {
    isLiked: (state) => (event) => {
      if (!state.user) return false // we don't know yet
      return state.user.events.includes(event.id)
    },
  },
  mutations: {
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
