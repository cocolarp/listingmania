<template>
  <vue-slider ref="slider" v-bind="config" v-model="value">
  </vue-slider>
</template>

<script>
import invert from 'lodash.invert'
import last from 'lodash.last'

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
  computed: {
    value: {
      get: function () {
        const state = this.$store.state

        if (state.maxDistance == null) return last(VALUES_ARRAY)

        if (state.maxDistance <= 10) return VALUES_ARRAY[0]
        if (state.maxDistance <= 50) return VALUES_ARRAY[1]
        if (state.maxDistance <= 250) return VALUES_ARRAY[2]
        if (state.maxDistance <= 500) return VALUES_ARRAY[3]

        return last(VALUES_ARRAY)
      },
      set: function (newValue) {
        const distance = invert(AVAILABLE_DISTANCES)[newValue] || null
        bus.$emit('distance_changed', distance)
      },
    },
  },
  components: {
    'vue-slider': vueSlider,
  },
}
</script>

<style>
</style>
