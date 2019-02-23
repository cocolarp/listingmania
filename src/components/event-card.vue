<template lang="pug">
v-card(hover, elevation-4, :class="{'selected': event.selected}")
  v-img(height='150px')
    v-container
      v-layout(row)
        v-flex(xs10).pa-0
          .subheading.grey--text.d-inline {{ event.name }}
        v-spacer
        .subheading.grey--text.d-inline {{ event.readable_cost }}
      v-layout(row).mt-2
        v-icon(small) calendar_today
        span &nbsp;
        span.caption {{ event.start.format('ll') }}
  v-divider
  v-card-actions.pl-4.pr-4
    v-icon(small) timelapse
    span &nbsp;
    span.caption {{ event.humanDuration }}
    v-spacer
    v-btn(flat, icon, color='blue darken-2', @click.stop.prevent="$emit('localize', event)")
      v-icon(small) place
    heart(:event="event")
</template>

<script>
import Heart from 'src/components/heart.vue'

export default {
  props: ['event'],
  data: function () {
    return {
      displayDetail: false,
    }
  },
  computed: {
    translatedHumanDuration () {
      return this.$gettext(this.event.humanDuration)
    },
    croppedAddress () {
      if (!this.event.raw.location) return this.$gettext('Lieu à déterminer')

      let locationName = this.event.raw.location.name
      if (!locationName) return ''

      if (!this.event.raw.location.address) {
        locationName = locationName + ' ' + this.$gettext('(à confirmer)')
      }
      const maxLen = 50

      if (locationName.length <= maxLen) return locationName
      return locationName.substring(0, maxLen) + '…'
    },
  },
  components: {
    'heart': Heart,
  },
}
</script>

<style scoped>
.selected {
  background-color: #f8f8f8;
}
</style>
