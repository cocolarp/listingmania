<template>
  <vue-slider @callback="distanceChanged" ref="slider" v-bind="config" v-model="value">
  </vue-slider>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

import vueSlider from 'vue-slider-component'

import bus from 'src/msgbus'

import {
  AVAILABLE_DISTANCES,
  ANY_DISTANCE,
} from 'src/models'

const VALUES_ARRAY = Object.values(AVAILABLE_DISTANCES).concat(ANY_DISTANCE)

export default {
  data () {
    return {
      config: {
        height: 4,
        data: VALUES_ARRAY,
        disabled: false,
        show: true,
        speed: 0.1,
        tooltip: 'never',
        piecewise: true,
        piecewiseLabel: true,
      },
    }
  },
  methods: {
    distanceChanged: (value) => {
      const distance = _.invert(AVAILABLE_DISTANCES)[value] || null
      bus.$emit('distance_changed', distance)
    },
  },
  computed: mapState({
    value: function (state) {
      if (state.maxDistance == null) return _.last(VALUES_ARRAY)

      if (state.maxDistance <= 10) return VALUES_ARRAY[0]
      if (state.maxDistance <= 50) return VALUES_ARRAY[1]
      if (state.maxDistance <= 250) return VALUES_ARRAY[2]
      if (state.maxDistance <= 500) return VALUES_ARRAY[3]

      return _.last(VALUES_ARRAY)
    },
  }),
  components: {
    'vue-slider': vueSlider,
  },
}
</script>

<style>
</style>
