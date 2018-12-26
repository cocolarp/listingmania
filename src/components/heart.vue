<template lang="pug">
.heart(:style="{color: heartColor}")
  span(
    @mouseenter="doHighlightHeart()",
    @mouseleave="resetHeart()"
    @click="likeEvent()"
  ) &#x2764;
</template>

<script>
export default {
  props: ['event'],
  data: function () {
    return {
      highlightHeart: false,
    }
  },
  computed: {
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
