(<template lang="pug">
#location-root
  input(
    type="text",
    :placeholder="locationPlaceholder",
    ref="autocomplete",
    :value="placeAddress",
  )
</template>)

<script>
/* global google */

import { mapState } from 'vuex'

export default {
  mounted: function () {
    if (typeof google !== 'undefined') {
      const autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.hasOwnProperty('place_id')) { // has been resolved properly
          this.$store.commit('setPlace', place)
        } else {
          this.$store.commit('resetPlace')
        }
      })
    } else {
      console.warn("google API not loaded: can't autocomplete")
    }
  },
  computed: {
    locationPlaceholder () { return this.$gettext('D\'où partez-vous?') },
    ...mapState({
      placeAddress: (state) => {
        if (state.place) {
          return state.place.formatted_address
        }
      },
    }),
  },
}
</script>
