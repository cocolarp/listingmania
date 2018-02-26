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

export default {
  props: ['place'],
  mounted: function () {
    if (typeof google !== 'undefined') {
      const autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.hasOwnProperty('place_id')) { // has been resolved properly
          this.$emit('change', place)
        } else {
          this.$emit('change', null)
        }
      })
    } else {
      console.warn("google API not loaded: can't autocomplete")
    }
  },
  computed: {
    locationPlaceholder () { return this.$gettext('D\'où partez-vous?') },
    placeAddress () {
      if (this.place) {
        return this.place.formatted_address
      }
    },
  },
}
</script>
