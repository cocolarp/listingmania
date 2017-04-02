import moment from 'moment'
import { mapState } from 'vuex'

import {CODE_ANY, FRANCE, DURATIONS} from 'src/models'

// FIXME(vperron): http://api.geonames.org/countryInfo?username=vperron
// FIXME(vperron): http://api.geonames.org/children?geonameId=3175395&username=demo
import frenchRegions from 'src/data/french-regions.csv'

const REGION_MAP = frenchRegions.reduce((acc, r) => {
  acc[r.code] = r.name
  return acc
}, {})


function areEquivalentStrings(a, b) {
  return a.toLowerCase() === b.toLowerCase()
}

const modelFilters = {
  month: function (value) {
    const intValue = parseInt(value, 10) - 1
    return (d) => d.start.month() === intValue
  },
  duration: function (value) {
    return (d) => areEquivalentStrings(d.duration, value)
  },
  country: function (value) {
    if (value === CODE_ANY) return (d) => d
    return (d) => areEquivalentStrings(d.country, value)
  },
  region: function (value) {
    if (value === CODE_ANY) return (d) => d
    return (d) => areEquivalentStrings(d.region, value)
  },
  textFilter: function (value) {
    return (d) => {
      return (
        d.name.toLowerCase().includes(value) ||
        d.organization.toLowerCase().includes(value)
      )
    }
  },
}

export default {
  data: function () {
    return {
      rawLarps: [],
    }
  },
  computed: {
    durations: function () {
      const acc = []
      for (let key of Object.keys(DURATIONS)) {
        acc.push({
          type: 'duration',
          code: key,
          text: DURATIONS[key],
        })
      }
      return acc
    },
    months: function () {
      const acc = []
      for (let [index, value] of moment.monthsShort().entries()) {
        acc.push({
          type: 'month',
          code: `${index + 1}`,
          text: value,
        })
      }
      return acc
    },
    countries: function () {
      const countries = [...new Set(this.rawLarps.map((larp) => larp.country))].sort()
      return [{
        code: CODE_ANY,
        text: 'Tous',  // FIXME gettext
        type: 'country',
      },
      ...countries.map((c) => {
        return {
          code: c,// FIXME(vperron): horrible until I parse the countries properly
          text: c,
          type: 'country',
        }
      })]
    },
    regions: function () {
      return [{
          code: CODE_ANY,
          text: 'Toutes',  // FIXME gettext
          type: 'region',
        },
        ...frenchRegions.map((r) => {
          return {
            code: r.code,
            text: `${r.code} - ${r.name}`,
            type: 'region',
          }
      })]
    },

    ...mapState({
      filter: (state) => state.filter || '',
      country: function (state) {
        return this.countries.find((c) => c.code === state.country)
      },
      region: function (state) {
        return this.regions.find((c) => c.code === state.region)
      },
      isFrance: (state) => state.country === FRANCE,
      larps: function (state) {
        const filters = []

        if (state.month) filters.push(modelFilters.month(state.month))
        if (state.duration) filters.push(modelFilters.duration(state.duration))
        if (state.country) filters.push(modelFilters.country(state.country))
        if (state.country === FRANCE && state.region) {
          filters.push(modelFilters.region(state.region))
        }

        if (state.filter) filters.push(modelFilters.textFilter(state.filter))

        return this.rawLarps.filter((larp) => {
          return filters.reduce((all, f) => all && f(larp), true)
        })
      },
    }),
  },
}
