<template lang="pug">
v-card(hover, elevation-4)
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
  v-card-actions.pa-2
    v-btn(flat, icon, @click="displayDetail = !displayDetail")
      v-icon {{ displayDetail ? 'expand_less' : 'expand_more' }}
    v-spacer
    v-btn(flat, icon, color='red')
      v-icon(small) favorite_border
  template(v-if="displayDetail")
    v-divider
    v-container.pa-2
      v-layout(column)
        v-flex(xs12).pb-1
          v-icon(small) group
          span &nbsp;
          span.caption {{ event.organization }}
        v-flex(xs12).pt-1.pb-1
          v-icon(small) location_on
          span &nbsp;
          span.caption {{ croppedAddress }}
        v-flex(xs12).pt-1
          v-icon(small) timelapse
          span &nbsp;
          span.caption {{ event.humanDuration }}
</template>

<script>
export default {
  props: ['event'],
  data: function () {
    return {
      displayDetail: false,
    }
  },
  methods: {
    toggleDetail () {
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
      const maxLen = this.shouldDisplayKms ? 22 : 26

      if (locationName.length <= maxLen) return locationName
      return locationName.substring(0, maxLen) + '…'
    },
  },
}
</script>

<style scoped>
</style>
