<template lang="pug">
v-card
  v-card-title
    v-container.headline.pa-0.ma-0
      v-layout(row)
        v-flex(xs10).pa-0
          span {{ event.name }}
        v-spacer
        span {{ event.readable_cost }}
        v-btn.topleft(flat, icon, @click="event.dialog = false", color='grey')
          v-icon close
  v-card-text
    p.description {{ event.description }}
</template>

<script>
export default {
  props: {
    event: Object,
  },
}
</script>

<style scoped>
@import "src/variables.css";

.topleft {
  top: -8px;
}

.description {
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* ancient Opera */
  white-space: -o-pre-wrap; /* newer Opera */
  white-space: pre-wrap; /* Chrome; W3C standard */
  word-wrap: break-word; /* IE */
}
</style>
