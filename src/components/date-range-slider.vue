<template>
  <vue-slider @callback="dateRangeChanged" ref="slider" v-bind="config" v-model="value">
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
import _ from 'lodash'
import moment from 'moment'
import {mapState} from 'vuex'

import vueSlider from 'vue-slider-component'

import bus from 'src/msgbus'


function isValidDate (dates, d) {
  return (d != null && d.isSameOrAfter(dates[0].value) && d.isSameOrBefore(dates[1].value))
}

const start = moment().startOf('month')
const momentArray = _.times(18, (x) => start.clone().add(x, 'months')).map((m, idx) => {
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
  methods: {
    dateRangeChanged: (value) => {
      bus.$emit('date_range_changed', value.map((d) => d.value))  // emit only the moments
    },
  },
  computed: mapState({
    value: function (state) {
      let dates = [momentArray[0], _.last(momentArray)]

      if (isValidDate(dates, state.startDate)) {
        const entry = _.find(momentArray, (d) => d.value.isSame(state.startDate, 'month'))
        dates = [entry, dates[1]]
      }

      if (isValidDate(dates, state.endDate)) {
        const entry = _.find(momentArray, (d) => d.value.isSame(state.endDate, 'month'))
        dates = [dates[0], entry]
      }

      return dates
    },
  }),
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
