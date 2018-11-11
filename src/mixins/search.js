import Vue from 'vue'

import isnan from 'lodash.isnan'
import clonedeep from 'lodash.clonedeep'

import * as models from 'src/models'
import {getPlaceDetails} from 'src/services/google'

import checkBox from 'src/components/check-box.vue'
import dateRangeSlider from 'src/components/date-range-slider.vue'
import distanceSlider from 'src/components/distance-slider.vue'
import locationInput from 'src/components/location-input.vue'

const ALLOWED_DISTANCES = Object.keys(models.AVAILABLE_DISTANCES).map(
  (d) => parseInt(d, 10)
)

const str2bool = (x) => x === 'true'
const bits2str = (arr) => arr.map((x) => x ? '1' : '0').join(',')
const str2bits = (value) => value.split(',').map((m) => parseInt(m, 10) === 1)


function popEvents () {
  setTimeout(() => {
    const cards = document.getElementsByClassName('event-card')
    for (let card of cards) {
      card.classList.add('pop-animate')
      setTimeout(() => {
        card.classList.remove('pop-animate')
      }, 500)
    }
  }, 100)
}

const DEFAULTS = {
  sort: 'start',
  durations: Array(3).fill(true),
  months: Array(13).fill(false).fill(true, 0, 2),
  anywhere: true,
  my_events: false,
  place: null,
  max_distance: 500,
}

export default {
  data: function () {
    return {
      shakeLocationInput: false,
      ...clonedeep(DEFAULTS),
    }
  },
  components: {
    'check-box': checkBox,
    'distance-slider': distanceSlider,
    'date-range-slider': dateRangeSlider,
    'location-input': locationInput,
  },
  beforeRouteUpdate (to, from, next) {
    this.updateInstanceData(to.query)
    next()
  },
  methods: {
    updateInstanceData: async function (query) {
      const vm = this
      if (['distance', 'cost', 'start'].includes(query.sort)) {
        vm.sort = query.sort
      }

      if (query.durations) {
        vm.durations = str2bits(query.durations)
      }

      if (query.months) {
        vm.months = str2bits(query.months)
      }

      if (['true', 'false'].includes('' + query.anywhere)) {
        vm.anywhere = str2bool(query.anywhere)
      }

      if (['true', 'false'].includes('' + query.my_events)) {
        vm.my_events = str2bool(query.my_events)
      }

      const maxDistance = parseInt(query.max_distance, 10)
      if (
        maxDistance &&
        !isnan(maxDistance) &&
        ALLOWED_DISTANCES.includes(maxDistance)
      ) {
        vm.max_distance = maxDistance
      }

      if (query.place) {
        return getPlaceDetails(query.place).then((place) => {
          vm.place = place
        }, (err) => {
          console.log(err)
          console.warn('Place not found for id: ', query.place)
        })
      }

      return Promise.resolve()
    },
    _updateUrl (key, value, url_value) {
      let query_value = '' + url_value // force string
      if (Array.isArray(value)) {
        if (JSON.stringify(value) === JSON.stringify(DEFAULTS[key])) {
          query_value = undefined
        }
      } else {
        if (value === DEFAULTS[key]) {
          query_value = undefined
        }
      }
      const query = Object.assign({}, this.$route.query, {
        [key]: query_value,
      })
      this.$router.replace({query: query})
    },
    _updateData (key, value) {
      this[key] = value
      this._updateUrl(key, value, value)
      popEvents()
    },
    _doShakeLocationInput () {
      this.shakeLocationInput = true
      setTimeout(() => {
        this.shakeLocationInput = false
      }, 1500)
    },
    toggleMyEventsOnly (value) {
      if (this.$store.state.user) {
        this._updateData('my_events', value)
      } else {
        this.$store.commit('showLoginForm', true)
      }
    },
    updateAnyTime (value) {
      this.months = Array(13).fill(value)
      this._updateUrl('months', this.months, bits2str(this.months))
      popEvents()
    },
    updateAnyWhere (value) {
      if (!this.place) {
        this._doShakeLocationInput()
      }
      this._updateData('anywhere', value)
    },
    updateMaxDistance (value) {
      this._updateData('max_distance', value)
    },
    updatePlace (value) {
      this.place = value
      if (value == null) {
        this._updateUrl('place', this.place, undefined)
      } else {
        this._updateUrl('place', this.place, value.place_id)
      }
      popEvents()
    },
    toggleMonth (index) {
      const nextValue = !this.months[index]
      Vue.set(this.months, index, nextValue)
      this._updateUrl('months', this.months, bits2str(this.months))
      popEvents()
    },
    toggleDuration (index) {
      const nextValue = !this.durations[index]
      Vue.set(this.durations, index, nextValue)
      this._updateUrl('durations', this.durations, bits2str(this.durations))
      popEvents()
    },
    setSortKey (value) {
      this._updateData('sort', value)
    },
  },
  computed: {
    everyTimeCheckboxLabel () { return this.$gettext('Toutes les dates') },
    anyWhereCheckboxLabel () { return this.$gettext('Dans le monde entier') },
    myEventsCheckboxLabel () { return this.$gettext('Mes GNs uniquement') },
    anytime () {
      return this.months.every((x) => x === true)
    },
    canSearch () {
      return (this.anywhere || this.place)
    },
  },
}
