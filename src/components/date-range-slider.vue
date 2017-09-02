<template>
  <vue-slider ref="slider" v-bind="config" v-model="value">
    <template slot="label" scope="data">
      <div v-if="data.label.isYearStart" class="date-slider-year-label">{{ data.label.value.format('YYYY') }}</div>
      <span class="hidden-xs-only vue-slider-piecewise-label">{{ data.label.value.format('MMM') }}</span>
    </template>
    <template slot="tooltip" scope="tooltip">
      <span v-if="tooltip.value && tooltip.value.value" class="hidden-sm-and-up vue-slider-tooltip">{{ tooltip.value.value.format('MMM YYYY') }}</span>
    </template>
  </vue-slider>
</template>

<script>
import find from 'lodash.find'
import last from 'lodash.last'
import times from 'lodash.times'
import moment from 'moment'

import vueSlider from 'vue-slider-component'

import bus from 'src/msgbus'


function isValidDate (dates, d) {
  return (d != null && d.isSameOrAfter(dates[0].value) && d.isSameOrBefore(dates[1].value))
}

const start = moment().startOf('month')
const momentArray = times(18, (x) => start.clone().add(x, 'months')).map((m, idx) => {
  return {
    isYearStart: idx === 0 || m.month() === 0,
    value: m,
  }
})

export default {
  data () {
    return {
      config: {
        height: 4,
        data: momentArray,
        disabled: false,
        show: true,
        speed: 0.1,
        tooltip: 'hover',
        piecewise: true,
        piecewiseLabel: true,
        labelStyle: {
          'visibility': 'visible',
          'width': '12px',
          'height': '12px',
        },
      },
    }
  },
  computed: {
    value: {
      get: function () {
        const state = this.$store.state

        let dates = [momentArray[0], last(momentArray)]

        if (isValidDate(dates, state.startDate)) {
          const entry = find(momentArray, (d) => d.value.isSame(state.startDate, 'month'))
          dates = [entry, dates[1]]
        }

        if (isValidDate(dates, state.endDate)) {
          const entry = find(momentArray, (d) => d.value.isSame(state.endDate, 'month'))
          dates = [dates[0], entry]
        }

        return dates
      },
      set: function (newValue) {
        bus.$emit('date_range_changed', newValue.map((d) => d.value))  // emit only the moments
      },
    },
  },
  components: {
    'vue-slider': vueSlider,
  },
}
</script>

<style>
.date-slider-year-label {
  font-weight: bold;
  transform: translate(-15px,-30px);
}
</style>
