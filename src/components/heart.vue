<template lang="pug">
.heart(:style="{color: heartColor}")
  span(
    :data-balloon="popupText",
    data-balloon-pos="up",
    @mouseenter="doHighlightHeart()",
    @mouseleave="resetHeart()"
    v-on:click.stop.prevent="likeEvent()"
  ) &#x2764;
</template>

<script>
import 'balloon-css'

export default {
  props: ['event'],
  data: function () {
    return {
      highlightHeart: false,
    }
  },
  computed: {
    popupText () {
      return this.$gettext('Ajouter à mes GNs favoris')
    },
    isLiked () {
      return this.$store.getters.isLiked(this.event)
    },
    heartColor () {
      if (this.highlightHeart) return '#333'
      if (this.isLiked) return '#D16E47'
      return '#999'
    },
  },
  methods: {
    doHighlightHeart () {
      this.highlightHeart = true
    },
    resetHeart () {
      this.highlightHeart = false
    },
    likeEvent: function () {
      this.$ga.event({
        eventCategory: 'LikeButton',
        eventAction: 'click',
      })
      if (!this.$store.state.user) {
        this.$store.commit('showLoginForm', true)
      } else {
        this.event.doLike().then(() => {
          this.resetHeart()
        })
      }
    },
  },
}
</script>

<style scoped>
.heart {
  cursor: pointer;
  font-size: 1.2rem;
  display: inline-block;
}
</style>
