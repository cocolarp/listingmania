<template lang="pug">
v-btn(flat, icon, color='red', @click.stop.prevent="likeEvent()")
  v-icon(small) {{ heartIcon }}
  span &nbsp;{{ event.like_count }}
</template>

<script>
export default {
  props: ['event'],
  computed: {
    isLiked () {
      return this.$store.getters.isLiked(this.event)
    },
    heartIcon () {
      if (this.isLiked) {
        return 'favorite'
      }
      return 'favorite_border'
    },
  },
  methods: {
    likeEvent: function () {
      this.$ga.event({
        eventCategory: 'LikeButton',
        eventAction: 'click',
      })
      if (!this.$store.state.user) {
        this.$store.commit('showLoginForm', true)
      } else {
        this.event.doLike().then((isLiked) => {
          if (isLiked) {
            this.event.like_count += 1
          } else {
            this.event.like_count -= 1
          }
        })
      }
    },
  },
}
</script>

<style scoped>
</style>
