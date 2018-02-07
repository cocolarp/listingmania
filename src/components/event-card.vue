<template lang="pug">
.event-card(
  :style="{color: mainColor}"
  @mouseenter="highlightBackground()",
  @mouseleave="resetBackground()"
)
  .name {{ event.name }}
  .heart(
    :style="{color: heartColor}"
    @mouseenter="highlightHeart()",
    @mouseleave="resetHeart()"
    @click="likeEvent()"
  ) &#x2764;
  .date-details(:style="{color: durationColor}")
    span {{ event.start.format('lll') }}
    span &nbsp;|&nbsp;
    span {{ event.duration.humanize() }}
  .separator
  .description {{ event.summary }}
  .location-details
    .location
      span {{ event.address | crop }}
      span(v-show='shouldDisplayKms') &nbsp;|&nbsp;
      span(v-show='shouldDisplayKms') {{ event.distance }}kms
    .price {{ event.readable_cost }}
</template>

<script>
import {mapState} from 'vuex'

import {DURATION_COLOR} from 'src/models'

export default {
  props: ['event'],
  data: function () {
    return {
      mainColor: '#999',
      heartColor: this.getHeartDefaultColor(),
    }
  },
  computed: {
    durationColor() {
      return DURATION_COLOR[this.event.durationCategory]
    },
    ...mapState({
      shouldDisplayKms(state) {
        return !state.anyWhere && this.event.distance
      },
    })
  },
  methods: {
    highlightBackground() {
      this.mainColor = this.durationColor
    },
    resetBackground() {
      this.mainColor = '#999'
    },
    highlightHeart() {
      this.heartColor = '#333'
    },
    resetHeart() {
      this.heartColor = this.getHeartDefaultColor()
    },
    getHeartDefaultColor() {
      if (this.event.isLiked) return '#D16E47'
      return '#999'
    },
    likeEvent: async function () {
      if (!this.$store.state.user) {
        this.$store.commit('showLoginForm', true)
      } else {
        await this.event.like()
        this.resetHeart()
      }
    },
  },
  filters: {
    crop: function (str) {
      if (!str) return ''
      if (str.length <= 31) return str
      return str.substring(0, 31) + '…'
    },
  }
}
</script>

<style scoped>
.event-card {
  background-color: white;
  font-family: Geomanist;
  color: var(--highlight-text-color);
  border-top-right-radius: 0.5rem;
  display: inline-block;
  padding: 0.5rem;
  border: var(--highlight-text-color) solid 1px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 0.8rem;
  width: 100%;
  position: relative;
}

.heart {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 1.2rem;
}

.name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
}

.date-details {
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
  -webkit-line-clamp: 2;
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
