/* global gapi */

import _ from 'lodash'
import moment from 'moment'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import Vue from 'vue'
import Vuex from 'vuex'

import headerImg from 'src/logo.png'
import 'src/styles.css'

import * as models from './models'
import * as url from './url_utils'

// We have to also import the root element to have it precompiled. Yep.
import rootComponent from './components/root.vue'
import btnItem from './components/btn-item.vue'
import dropdownItem from './components/dropdown-item.vue'
import larpLine from './components/larp_line.vue'

const API_KEY = 'AIzaSyCDjYyOPVtg43sXCTvJtdHtlJySKa4EN0I'
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4']
const SPREADSHEET_ID = '1zQZM5nrsHXLO74MXa7EBnL4aUiJe6BhSvIRWWbRtDNc'
const SPREADSHEET_RANGE = 'PROCHAINS GNs FRANCE'

document.getElementById('headerImg').src = headerImg

Vue.use(Vuex)

moment.locale('fr')  // FIXME: Be international, detect and let the user choose!

const store = new Vuex.Store({
  state: {
    month: null,
    duration: null,
    country: models.CODE_ANY,
    region: models.CODE_ANY,
    filter: null,
  },
  mutations: {
    setMonth (state, value) {
      state.month = value
    },
    setDuration (state, value) {
      state.duration = value
    },
    setCountry (state, value) {
      state.country = value
    },
    setRegion (state, value) {
      state.region = value
    },
    setFilter (state, value) {
      state.filter = value
    },
  },
})

const app = new Vue({  // eslint-disable-line no-new
  el: '#content',
  store,
  ...rootComponent,
  mounted: function () {
    console.log('component root was mounted')
  },
  methods: {
    updateFilter: _.debounce(function (e) {
      const value = e.target.value !== '' ? e.target.value.toLowerCase() : null
      this.$store.commit('setFilter', value)
    }, 250),
    updateUrl: function ({type, code}) {
      switch (type) {
        case 'country':
        case 'region':
          if (code === models.CODE_ANY) {
            url.updateParamsWith(type, undefined)
          } else {
            url.updateParamsWith(type, code)
          }
          break
        case 'month':
        case 'duration':
          url.updateParamsWith(type, code, true)
      }
      updateApplication()
    },
  },
  components: {
    'btn-item': btnItem,
    'dropdown-item': dropdownItem,
    'larp-line': larpLine,
  }
})

function updateApplication () {
  store.commit('setMonth', url.getMonth())
  store.commit('setDuration', url.getDuration())
  store.commit('setCountry', url.getCountry() || models.CODE_ANY)
  store.commit('setRegion', url.getRegion() || models.CODE_ANY)
}

async function appStart () {
  await gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    apiKey: API_KEY,
  })
  const {result} = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SPREADSHEET_RANGE,
  })
  app.rawLarps = models.transformRawData(result.values)
  updateApplication()
}

if (process.env.NODE_ENV !== 'production') {
  app.rawLarps = models.transformRawData(require('src/data.json'))
  updateApplication()
} else {
  gapi.load('client', appStart)
}
