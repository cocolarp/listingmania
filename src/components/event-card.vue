<template lang="pug">
.event-card(
  :style="{'background-color': mainColor}"
  @mouseenter="highlightBackground()",
  @mouseleave="resetBackground()"
  @click="goToEventPage()",
)
  .name {{ event.name }}
  heart(:event="event")
  .date-details(
    :style="{color: durationColor}"
    @click="goToEventPage()",
  )
    span {{ event.start.format('LL') }}
    span &nbsp;|&nbsp;
    span {{ translatedHumanDuration }}
  .tag-section
    .tag(v-for="tag in event.tags", :key="tag.key") {{ $gettext(tag.label) }}
  .separator
  .description {{ event.summary }}
  .location-details
    .location
      span {{ croppedAddress }}
      span(v-show='shouldDisplayKms') &nbsp;|&nbsp;
      span(v-show='shouldDisplayKms') {{ event.distance }}kms
    .price {{ event.readable_cost }}
  .lang-section
    span(v-if="event.languages", v-translate="") Langues:
    span &nbsp;
    span {{ event.languages }}
</template>

<script>
import Heart from 'src/components/heart.vue'

import { DURATION_COLOR } from 'src/enums'

export default {
  props: ['event', 'anywhere'],
  data: function () {
    return {
      mainColor: 'white',
    }
  },
  computed: {
    durationColor () {
      return DURATION_COLOR[this.event.durationCategory]
    },
    translatedHumanDuration () {
      return this.$gettext(this.event.humanDuration)
    },
    croppedAddress () {
      if (!this.event.raw.location) return this.$gettext("Lieu à déterminer")

      let locationName = this.event.raw.location.name
      if (!locationName) return ''

      if (!this.event.raw.location.address) {
        locationName = locationName + ' ' + this.$gettext("(à confirmer)")
      }
      const maxLen = this.shouldDisplayKms ? 22 : 26

      if (locationName.length <= maxLen) return locationName
      return locationName.substring(0, maxLen) + '…'
    },
    shouldDisplayKms () {
      return !this.anywhere && this.event.distance
    },
  },
  methods: {
    goToEventPage () {
      this.$router.push({ name: 'detail', params: { slug: this.event.id } })
    },
    highlightBackground () {
      this.mainColor = '#f5f5f5'
    },
    resetBackground () {
      this.mainColor = 'white'
    },
  },
  components: {
    heart: Heart,
  },
}
</script>

<style scoped>
@import "src/variables.css";

.event-card {
  cursor: pointer;
  background-color: white;
  font-family: Montserrat;
  color: var(--highlight-text-color);
  border-top-right-radius: 0.5rem;
  display: inline-block;
  padding: 0.5rem;
  border: var(--highlight-text-color) solid 1px;
  box-sizing: border-box;
  font-size: 0.8rem;
  width: 100%;
  position: relative;
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.20), 0 4px 0 0 rgba(0,0,0,0.10);
}

.tag-section {
  height: 2.5rem;
}

.lang-section {
  font-size: 0.6rem;
  margin-top: 0.6rem;
}

.tag {
  display: inline-block;
  color: #222;
  font-size: 0.6rem;
  border: 1px solid #666;
  padding: 2px;
  border-radius: 2px;
  margin: 2px;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.15);
}

.name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  display: inline-block;
}

.date-details {
  cursor: pointer;
  padding: 0.3rem 0;
  font-weight: bold;
}

.separator {
  width: 30%;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 0.3rem 0;
  padding: 0;
}

.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  line-height: 1rem;
  height: 4rem;
  max-height: 4rem;
  text-overflow: ellipsis;
}

.location-details {
  font-weight: bold;
  margin-top: 0.4rem;
  margin-left: -0.5rem;
  margin-bottom: -0.1rem;
  padding: 0.2rem 0.5rem;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top-right-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
}

.location {
  display: inline;
}

.price {
  display: inline;
  float: right;
}
</style>
