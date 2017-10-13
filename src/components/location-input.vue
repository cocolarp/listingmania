<template lang="pug">
#location-root
  input(
    type="text",
    placeholder="D'où partez-vous?",
    ref="autocomplete",
    :value="placeAddress",
  )
</template>

<script>
/* global google */

import { mapState } from 'vuex'

import * as url from './../url_utils'

export default {
  mounted: function () {
    if (typeof google !== 'undefined') {
      const autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place) return
        this.$store.commit('setPlace', place)
      })
    } else {
      console.warn("google API not loaded: can't autocomplete")
    }
  },
  computed: mapState({
    placeAddress: (state) => {
      if (state.place) {
        return state.place.formatted_address
      }
    },
  }),
}
</script>

<style scoped>
#location-root > input {
  font-family: Geomanist;
  box-sizing: border-box;
  padding: 0px 15px;
  width: 100%;
  border-radius: 0.9rem;
  height: 2rem;
  border: none;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.20), 0 4px 0 0 rgba(0,0,0,0.10);
}
</style>
