<template>
<v-card>
  <v-container fluid>

    <v-layout row wrap>
      <v-flex xs12 md2>
        <v-subheader>
          <v-icon class="mr-2">date_range</v-icon>Quand ?
        </v-subheader>
      </v-flex>
      <v-flex xs12 md10>
        <date-range-slider></date-range-slider>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 md2>
        <v-subheader>
          <v-icon class="mr-2">room</v-icon>Où ?
        </v-subheader>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          ref="autocomplete"
          :value="place"
          ></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <distance-slider></distance-slider>
      </v-flex>
    </v-layout>

  </v-container>
</v-card>
</template>

<script>
/* global google */

import { mapState } from 'vuex'

import bus from 'src/msgbus'

import dateRangeSlider from './date-range-slider.vue'
import distanceSlider from './distance-slider.vue'

export default {
  components: {
    'date-range-slider': dateRangeSlider,
    'distance-slider': distanceSlider,
  },
  mounted: function () {
    const autocompleteDiv = this.$refs.autocomplete
    const input = autocompleteDiv.$el.getElementsByTagName('input')[0]
    const autocomplete = new google.maps.places.Autocomplete(input)

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place) return
      bus.$emit('place_changed', place)
    })
  },
  computed: mapState({
    place: 'placeName',
  }),
}
</script>
