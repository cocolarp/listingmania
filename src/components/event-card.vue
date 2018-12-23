<template lang="pug">
.event-card(
  :style="{color: mainColor}"
  @mouseenter="highlightBackground()",
  @mouseleave="resetBackground()"
)
  .name(
    @click="goToEventPage()",
  ) {{ event.name }}
  .heart(
    :style="{color: heartColor}"
    @mouseenter="doHighlightHeart()",
    @mouseleave="resetHeart()"
    @click="likeEvent()"
  ) &#x2764;
  .date-details(
    :style="{color: durationColor}"
    @click="goToEventPage()",
  )
    span {{ event.start.format('LL') }}
    span &nbsp;|&nbsp;
    span {{ translatedHumanDuration }}
  .separator
  .description {{ event.summary }}
  .location-details
    .location
      span {{ croppedAddress }}
      span(v-show='shouldDisplayKms') &nbsp;|&nbsp;
      span(v-show='shouldDisplayKms') {{ event.distance }}kms
    .price {{ event.readable_cost }}
</template>

<script>
import HeartMixin from 'src/mixins/heart.js'

import { DURATION_COLOR } from 'src/models'

export default {
  mixins: [HeartMixin],
  props: ['event', 'anywhere'],
  data: function () {
    return {
      mainColor: '#999',
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
      const locationName = this.event.raw.location.name
      if (!locationName) return ''
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
      this.mainColor = this.durationColor
    },
    resetBackground () {
      this.mainColor = '#999'
    },
  },
}
</script>

<style scoped>
@import "src/variables.css";

.event-card {
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
}

.heart {
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 1.2rem;
}

.name {
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1rem;
  height: 3rem;
  max-height: 3rem;
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
